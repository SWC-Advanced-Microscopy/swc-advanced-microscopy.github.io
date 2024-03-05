---
title: "Registering widefield functional imaging data to the Allen Atlas"
excerpt: "Using blood vessel patterns to register in vivo data"
header:
  teaser: "/assets/images/posts/volume_view_vessels_teaser.jpg"
categories:
  - Analysis
tags: 
  - Registration
toc: false
---
 
Is it possible to register the brain surface as seen in widefield *in vivo* imaging to the Allen Atlas?

![image-left]({{ site.baseurl }}/assets/images/posts/volume_view_vessels.jpg){: .align-left} Displaying downsampled serial section data in Fiji's volume viewer shows that at least larger blood vessels are visible on the surface rendering. Ivana Orsolic and Petr Znamenskiy decided to use the vessels to register widefield functional imaging data to serial section stacks and so to the Allen Atlas.

The brain was sliced and imaged, then the downsampled volume was [registered to the Allen Atlas as usual]({{ site.baseurl }}/registration). 
The 3D image stack is now in the same space as the Allen Atlas.
Using Petr's [recoverVasculature function](https://github.com/SainsburyWellcomeCentre/StitchIt/blob/master/code/stitchedStackManipulation/recoverVasculature.m) found in [StitchIt](https://github.com/SainsburyWellcomeCentre/StitchIt) the blood vessel patterns (now also in the Atlas space) are extracted from the downsampled serial section data. 
An affine transformation based on the vessels brings the *in vivo* data into the same space as the sample and hence into the same space as the Atlas. 



<figure>
    <a href="{{ site.baseurl }}/assets/images/posts/VasculatureRegFig.jpg">
        <img src="{{ site.baseurl }}/assets/images/posts/VasculatureRegFig.jpg" >
    </a>
</figure>


### References
This work was inspired by the Allen Institute [informatics white paper](http://help.brain-map.org/download/attachments/2818171/Conn_Informatics_Data_Processing.pdf) on serial 2p processing.