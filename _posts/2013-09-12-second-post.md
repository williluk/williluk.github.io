---
title: "Retrospective: Machine Learning Simulation"
author: Luke
layout: post
---

This project hails from my first year at Oregon State University. I always loved open-ended assignments that allowed me to more deeply invest in my work, and this is a perfect example of what that yields. This website effectively uses a small engine I created in HTML/CSS and Javascript to simulate a group of little creatures eating food and multiplying. You can watch the creatures evolve over the course of about 10 minutes of executions. They pretty consistently discover "go fast" as their primary method, but over long enough runs I've observed them moving in waves to try and cover more ground.

<a href="https://web.engr.oregonstate.edu/~williluk/sim/sim.html" class="button">See the simulation in action!</a>

Each of these critters is controlled using its own small neural network which translates 3 short vision raycasts as inputs into forward and angular velocity. The basic physics of this movement, the div-based graphics, and collisions are all handled by the engine.


This project expanded my understanding in a few key spaces. For one thing, it is my first experience ever working with neural networks. To keep a reasonable framerate completely client side, I ended up incorporating many matrix multiplication optimizations. The individual and total execution times are displayed in the project itself. Another major point of optimization was in handling collisions. The collision system handles objects in a grid system, and uses a sly method for checking line segments for overlap that I discovered while researching for the project.


In the end, these optimizations didn't do enough to free the program from its core limitations. The grid-based collisions are such a detriment to the raycast-based vision of the critters that I've never seen them actually learn how to see food. Their vision is simply too bad. I am however curious to revisit this project divorced from the limitations of a website, and maybe see if I can't simulate something more unique.
