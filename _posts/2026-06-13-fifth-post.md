---
title: "Retrospective: Pixel Renderer"
author: Luke
layout: post
---

This was a small project I worked on while I was experimenting more in depth with the Godot Engine. The goal was to create a set of shaders that would turn simpler 3D environments into stellar pixel art. If you are a savvy member of the computer graphics world, you may recognize my emulation of the work of the brilliant [t3ssel8r](https://www.youtube.com/@t3ssel8r). On top of that, I'd certainly like to credit [this article by David Hollend](https://www.davidhol.land/articles/3d-pixel-art-rendering/) and the excellent [videos by Dylearn](https://www.youtube.com/@Dylearn/videos) for documenting their journeys through this process.


There were many tough challenges, particularly correcting pixel swimming with camera motion and handling water reflections. This implementation uses reflection probes, which involves patching the Godot Engine to handle custom camera frustrums. Despite the headache, Godot has rapidly become my new favorite engine due primarily to how slim it is to run and how much of a boon open source can be.

<iframe frameborder="0" title="Fixed Signals by Luke Williams" allowfullscreen="" width="1075" height="620" src="https://web.engr.oregonstate.edu/~williluk/Build/index.html">
                    </iframe>
