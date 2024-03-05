---
title: "Stage alignment to imaging plane"
excerpt: "How to ensure the imaging plane is aligned with the stage axes"
author: robc
header:
  teaser: "/assets/images/home/GCamp6s_brain.jpg"
categories:
  - Acquisition
tags: 
  - Maintenance
  - Alignment
toc: false
---


 For a tile-scanning microscope it is important for the image plane to be aligned with the stage motion axes. Specifically, the following must be the case:

1. The scanners must displace the beam along orthogonal directions.
2. The X/Y stages must displace the sample along orthogonal axes.
3. The X scanner should move the beam along the direction of motion of the X stage.
4. The Y scanner should move the beam along the direction of motion of the Y stage. 
5. The scanning plane (imaging plane) should be parallel with the plane of motion of the X and Y stages. 

You can measure whether the scanners are orthogonal to each other by imaging a sub-micron grid and checking that the imaged grid lines are orthogonal to each other. 
We use the [2145C 25 micron grids](http://www.2spi.com/search/2145C/) from 2SPI.
Simply image them through a cover-slip at about 10 mW at the sample. 
It is likely that the stages are already orthogonal to each other. 
Once you've verified the above, all you need to do is ensure that the X and Y scanners are parallel with the X and Y stage motion axes. 
The easiest way of doing this is to:

- Image a sample and identify  place a small, bright, object within it.
- Using the stages, place this object very close to one corner of the image. For example, place the point right at the top edge of the image. 
- Translate the stage such that this point moves along this edge. The further it is able to move, the better. 
- If the stage axes and scan axes aren't parallel with each other (i.e. the x/y stages are rotated with respect to where they should be) then you will see the point move away from or towards the edge of the image as it's translated. 
- If you can run ScanImage, then enable the cross-hair overlay on your channel window and use this is a guide.
- To correct any misalignment, loosen the bolts holding stages to the air table and gently rotate the stage platform in the appropriate direction. 
We used a [ThorLabs KL02](https://www.thorlabs.com/thorproduct.cfm?partnumber=KL02) to push one leg of the stage whilst holding the other leg in place with an [RSPC](https://www.thorlabs.com/thorproduct.cfm?partnumber=RSPC).
- Repeat the measurement and adjustment procedure until you can translate a small object along most of the width of the image without it moving with respect to the image edge. 


Ensuring that the imaging plane and the and stage motion plane are parallel is similar. 
We did this by imaging fluorescent microspheres and translating them across the frame and estimating the tilt by focusing with the PIFOC.
If the tilt is unacceptable for your purposes, you can correct it with the [adjustable stage tilt]({{ site.baseurl }}/acquisition/adjustable_stage_tilt) 
 modification.
