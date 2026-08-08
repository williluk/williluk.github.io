---
title: "Devlog #1: Orthographic God Rays In Godot"
tags: [Godot, Shaders]
style: fill
color: primary
description: In this first devlog, I talk about how I implemented a simple shader for God Rays in Godot.
---

# **Devlog #1: Orthographic God Rays In Godot**

**Preamble**

Hi. My name is Luke Williams, and I’m a game developer. Like many in my artistic world, I’ve decided to document my activities on my little corner of the globe-spanning billboard that is the Internet. I intend to cover whatever work that I’ve accomplished for my current project, ideally in a cleanly delineated and somewhat comprehensible format. Rather than spend ages explaining the state of this project and its high level design and goals… I won’t. You’ll get that information when I deem it relevant, so you are yet more at mercy to my impulsive nonsense. Enjoy your first dose, God Rays in Godot.

**Restrictions**

The specifics of this method only work with an Orthographic camera. In theory, it should be possible to change the math just a bit to get it working with Perspective, but I have not tested it.

**The Core Idea**

God rays are an effect created by intense light scattering through molecules in the air, creating a glow that sharply contrasts areas of shadow. My project’s art style is a nice 3D pixel art inspired by the brilliant t3ssel8r (check out [this article by David Holland](https://www.davidhol.land/articles/3d-pixel-art-rendering/)), and for me the god rays do so much to add a bit of depth back into the scene. Volumetrics are reeeeeally intensive, however, and so the particular implementation that I was interested in was a shell texturing technique described in the above David Holland article and in a Reddit post by [the amazing Dylearn](https://www.youtube.com/@Dylearn). It's procedural, meaning it doesn’t need to be set up for every scene, and it looks fantastic. This implementation should also work with pretty much any stylistic visual style, but keep in mind it’s only built to work with Directional Lights. Here is how it was described:

> “Sure! As inspired by u/denovodavid, the godrays are multimesh instanced quads. Using shaders you can set the x and y coordinates of the quad vertices in view space to their respective corners of the screen. Then use linear algebra to solve for z in view space along a plane parallel to light direction. After, you use the attenuation (shadow) to set the alpha value, so that parts in shade go transparent!”

![An image from Dylearn's original post](/assets/images/dylearn_screenshot.png)

Now, no shade at all to Dylearn. His videos are fantastic both informatively and presentationally, and I can’t expect someone who is generously taking time out of working on a game to describe every little piece of implementation. However, I had a great deal of trouble understanding this post. I’m also an idiot. Lucky for you, I’m an idiot who reverse engineered the effect after hours of work and created a blog just to yap about it.

The core idea is to layer semi-transparent quads on top of each other with regular gaps. The quads don’t render pixels which are in shadow, and thus areas in light will accumulate color, however most of the value of layering is so that the quads collide with objects in your scene at regular intervals. As these objects cast shadows down the rest of the quad, it will create the nice stark contrast we are looking for between volume of space in light and that in shadow.

The part that confused me initially was where these quads were supposed to be positioned in 3D space. The posts I found described that aspect only in vague terms, so let me set out all of the positional requirements and the logic behind them.

1. **The quads must be parallel to the light direction.** This one is pretty simple. Our god rays are created by clear lines separating light and shadow. If those lines are not aligned with the light and shadow defined by the actual light source, it will instantly break the illusion. You can easily tell if a quad is misaligned by comparing it to shadows cast on the floor of your scene.

2. **The quads must follow and mostly face the camera.** This rule is what makes the rays procedural. No matter the position or rotation of the camera, our rays should be visible and looking good. You’ll note that there are an infinite number of quads that are parallel to a vector, as you can effectively freely rotate the quads around the vector and still have it parallel. I say “mostly” facing because the plane will simply choose the rotation that causes it to best face the camera.

3. **The quads must fill the screen.** This one is less obvious, so allow me to explain. Our quads will be rotating to follow Rule #2, but given Rule #1 perfect alignment with the camera is not guaranteed. This means that there is potential for camera angles that are parallel or nearly parallel to the quad. If the plane is a static size, viewing the quad from these angles will give the user a great view of the edge of our plane, which completely breaks the effect. We’ll solve this by resizing the quad in our shader so that it's always big enough to prevent this from happening.
With all that in mind, I was able to begin implementing.

**Implementing**

I set up the quads as children of the camera with a brand-new shader, and getting the attenuation culling was super simple. From here, I had to figure out the position. Once I deduced our 3 Rules, I was able to figure out (look up) the mathematics required to get these planes in the proper position. Keep in mind that most of the math below is done in world space (I’ll talk about the important conversions at the end).

The process breaks down into two steps. Step one is to find a plane in point-normal form that is parallel to the light direction and sits at a given distance in front of the camera.

The point is pretty simple:

> plane point = camera position + (distance from camera) * camera forward direction

The normal is a bit more complex. For clarity, we are finding the component of the camera's facing direction that is orthogonal to the light direction. This solves both Rule 1 and Rule 2: the vector is orthogonal to the light direction (which aligns the plane) and it is secondarily pointing to the camera. Also, the "." below refers to the dot product operation.

> plane normal = -camera forward - (-camera_backward . light direction / light direction . light direction) * light direction

Now we have a mathematical plane in 3D space, but we haven’t actually moved the quad there. This will be a bit tricky because I’ll be using this stone to kill a couple different birds.

Remember Rule #3? Right now our mathematical plane spans infinitely in all directions, but all we really care about is the portion of it that is within the camera’s frustum (the portion of 3D space that it can see). This means that the four corners of our quad can be placed at the points where the four corners of our camera’s frustum intersect with our mathematical plane.

The intersection of a plane and vector can be found with this equation:

> intersect = camera corner point + ((plane point - camera corner point) . plane normal / -camera forward . plane_normal) * -camera forward;

Because the camera is orthographic, the direction of these vectors is just the camera facing direction, but the positions are a bit more funky. The solution I ended up using was passing the camera size into the shader via a global uniform, and then multiplying the initial quad vertex by that scale factor. Because the quad starts at the camera position with a width and height of one, this causes it to essentially fill the camera’s near plane, and from there each vertex is in the perfect position to represent the origin point of the vector we need.

From there it’s pretty much solved, but keep in mind that this intersection point is in world space. To set it as the new Vertex, you’ll need to transform it using the Model Matrix, and you better keep in mind that matrix multiplication is not commutative. You need to put the matrix on the left side of the multiplication symbol for it to work. I’m definitely not bringing this up because it's a mistake I made that cost me an absurd amount of time to fix.

You can download my actual shader file below if you’d like. Keep in mind that the effect is only really pronounced in scenes with lots of complex shadows. If it ends up looking like a fog or a bad filter, consider following the last section of this [tutorial by Dylearn](https://youtu.be/OxsuWDtjuGw?si=Zv3FzSEtDxvBxDP_&t=909) to implement clouds and incorporating them into the shader script.


