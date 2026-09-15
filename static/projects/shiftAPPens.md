#header Shift APPens; 2025/2026

#phrase Pixelization, ASCII, and computer vision inspired us. So I built a web tool that transforms images and video with these algorithms. That tool became the visual identity.
# Team
This took a team of five. I was lead designer. Pedro Anjinho, Leonor Brandão, and Nuno Pinto helped me define the visual identity. Ana Feu joined later to apply it across digital and physical surfaces. I built the web tool. Nuno and Anjinho designed [the website](https://shiftappens.com/) (not shown here since I wasn't involved, but it was an enormous endeavor on its own). The rest was split across the team.

The Shift APPens team (a joint effort between members of [NEI/AAC](https://nei.dei.uc.pt/) and [jeKnowledge](https://www.jeknowledge.pt/)) judged our output, plus the directive boards of both.
# Inspiration
While defining the visual identity, we looked at programming-adjacent graphics. Computer vision, dithering, terminal UIs, ASCII art, early gaming visuals, pixelization, vaporwave, digital collage.

We gravitated to [Enigmatriz's ASCII explorations](https://enigmatriz.com/artworks/ascii-art). Specifically artwork that used pixelization and ASCII characters superimposed to build shading, displaying more definition than either technique alone.

#endDiv
#gallery ![enigmatriz2.webp; 1; https://enigmatriz.com/artworks/ascii-art] ![enigmatriz1.webp; 2; https://enigmatriz.com/artworks/ascii-art]
#startDiv
Computer vision object detection was another big influence. Its boxy, rectangular overlays on organic images make a similar juxtaposition to the work shown above. Intellectually, it is just as interesting. Its procedural nature creates graphical compositions from surveillance. The visual product is a secondary effect, an emergent behavior.

![objectRecognition.png; 100]
# Tool development
I built a tool that combines pixelization and ASCII to abstract an image. Adding a flood-fill algorithm to outline groups of same-colored pixels, creating forms within forms.

#stiffGallery ![tree.png]; ![treeIDI.png]

The results were good enough to chase further. I ported the code from [Processing](https://processing.org/) to [P5.js](https://p5js.org/), then built an interface in [SvelteKit](https://svelte.dev/docs/kit/introduction) to tweak the parameters live. I added video support too, processing a video as images in bulk. The result led to a new idea of working the output: layering the generated image as a transparency layer over the original photo. This transformation is the closest to the rigid-organic contrast that drew us to our inspirations in the first place, rendering four different layers:

#logicChain ASCII; Group Pixel Outlines; Pixelization; Original Image.
#endDiv
+[videoExample.mp4; 100]
![slicesB.png; 100]
#startDiv

The program we ended up using featured a grand collection of parameters that changed the result considerably. The UI made it easy for exploration. Some micro-decisions were offset to the algorithm, making the visual product of human-computer collaboration. A "Redraw" button gave control over the computer. It re-rolled algorithm "choices", giving quick, different iterations. (See them animated in the second post under [Social Media](/project/shiftAPPens#social-media).)
# Visual Identity
Everything else, typography, colors, grid, came from the images the tool produced. We picked a bold, big sans-serif for legibility ([Inter](https://rsms.me/inter/)), since our generated images were often noisy. We defined four color sets, intended to be mixed between ASCII and pixelization for variety. The image output was striking enough that we could stay looser with other aspects. The logotype was something we could not remake as it is something that is carried on through editions.

# Social Media
As we made more Instagram posts, we found new ways to use the processor. Four styles stuck, shown below in order: as an object on a flat background, an abstract formless image, a transparent layer over a photo, and a background for ASCII art on top.

#gallery +[SApost1.mp4; 2]; +[SApost2.mp4; 2]; ![SApost3.jpg; 2]; ![SApost4.jpg; 2];
# Other Surfaces
Beyond Instagram, the aforementioned website, and boring stuff like documents, we made merch, stickers, and slides for the big screen at the hackathon.

#endDiv
#gallery ![tShirt.jpg; 1]; ![sweatShirt.jpg;2]
#gallery ![stickers.jpg; 2]; ![sticker.png;1]
![screen.jpg;100]
# Project in Review
Leaning so hard on the image processor sometimes meant less polish elsewhere. This shows up in [some cases](https://www.instagram.com/p/DXxYOD6DfQD/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==). When the generated image wasn't particularly interesting, the whole object fell apart.

Still, this project is more interesting for its process than its output. For me, it meant a new way of working.
#logicChain Conceptualize the identity; Make a tool; Realize the identity.

Beyond the wow factor, building a tool for one specific job speeds things up (I can't imagine how long one of [these posts](/project/shiftAPPens#social-media) would take to do manually). It also invites exploration within its own limits, and throws up unexpected results when going past them.
# Try the tool
I originally intended the web tool to be used in a small competition inside the hackathon. That never happened, so the UI is rough and clunky because it was made for the design team only. You'll figure it out. Try it [here](http://www.idi.rafasilvaarias.com).