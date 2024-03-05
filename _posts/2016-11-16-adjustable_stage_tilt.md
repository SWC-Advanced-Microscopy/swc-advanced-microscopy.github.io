---
title: "Adjustable stage tilt on TissueCyte"
excerpt: "How to add fine tip/tilt adjusters to the TissueCyte X/Y/Z stage"
author: robc
header:
  teaser: "/assets/images/posts/MF_stage_with_adjustable_pillars_03.jpg"
categories:
  - Acquisition
tags: 
  - Hacks
  - TissueCyte
  - Alignment
toc: false
---
 
The three legs supporting the stage are fixed in height. 
This means the tilt of the stage can not be changed. 
If you need to need to do this, is it possible to mount the stage on modified ThorLabs [**BLP01**](https://www.thorlabs.com/newgrouppage9.cfm?objectgroup_ID=1740&pn=BLP01) adjustable height 1.5" posts. 
The procedure will require machining facilities.

You will need to purchase three BLP01 posts (either imperial or metric will work) and three [**PF175**](https://www.thorlabs.com/thorproduct.cfm?partnumber=PF175) clamping forks. The minimum height of the posts is 108 mm, but the original support legs for the stage are about 91 mm high. We machined our posts such that their minimum height was just under 88 mm. The procedure for replacing the posts is easy and goes as follows:

- The three stage support legs are connected to the lower portion of the stage using hex-head screws that protrude through the top surface of this piece. Loosen these three screws, but don't remove them yet.
- Insert an adjustable height post under the stage and place it near the existing leg you will swap out first. Raise the post until it push gently against the bottom of the stage. This will support the stage when you swap out the leg. 
- Remove the screw coupling the existing leg to the stage. 
- Remove the screws holding the existing leg to the air table and slide out the leg from under the stage. 
- Screw the new leg into the stage, but don't tighten the screw. 
- Clamp the leg to the table using a PF175 clamping fork. 
- Repeat the procedure for the remaining two legs then tighten the screws holding the stage to the posts. 

If you are careful in setting the height of the posts before screwing them into place, the tilt of the stage should remain pretty much unchanged. Of course, the reason you're performing this modification is because you want to be able to *modify* the stage tilt. To modify the tilt:

- Loosen the screws holding the posts to the stage. 
- Alter the post heights as needed. 
- Tighten the screws whilst preventing the posts from rotating.
- Tighten the lock-ring on the posts. 

<figure class="third">
<a href="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_01.jpg"> <img src="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_01.jpg"> </a>
<a href="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_02.jpg"> <img src="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_02.jpg"> </a>
<a href="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_03.jpg"> <img src="{{ site.baseurl }}/assets/images/posts/MF_stage_with_adjustable_pillars_03.jpg"> </a>
</figure>

To make the imaging plane parallel with the stage motion plane:
- Dissolve some fluorescein in water in a 5 ml Eppendorf
- Pipette a small drop (about 10 ul) onto a slide such that when you coverslip it no fluid leaks out. 
You want a really small quantity. Seal the coverslip. 
- Image continuously and find the surface. 
- If the slide is parallel with the imaging plane, you will see the fluorescence pop into view throughout the field of view at the same time. If one corner or edge appears first then that side of the slide is higher than the other. 
- Before doing anything, you need to check that the slide itself is parallel with the motion axes of the stages. With the imaging plane just entering the fluorescein layer, translate each stage by about 2 mm. If the z depth appears to change negligibly then the slide is parallel with the stages. If it is not the case, look into why this might be. e.g. you may need to remove the water bath holder from the top stage and rest the slide directly on the stage itself. 
- Once you are happy that the slide is parallel with the motion axes, you can alter the stage tilt whilst imaging. e.g. Place your z-depth such that you can see the corner or edge that comes into focus first. Adjust the stage such that this corner or edge moves away from the objective. Move the objective down, find the edge again and repeat. Eventually you will have a nice flat imaging plane. 
- Note that if your fluorescein layer is thin enough you will see any field curvature the system may have. There's nothing simple you can do about that, so don't let it bother you. 

