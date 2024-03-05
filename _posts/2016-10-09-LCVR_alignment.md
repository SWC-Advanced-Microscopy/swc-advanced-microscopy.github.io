---
title: "TissueCyte Beam Alignment: LCVR"
excerpt: "Safely aligning the beam through the LCVR"
header:
  teaser: "/assets/images/posts/SM2_filter_holder.png"
categories:
  - Acquisition
tags: 
  - TissueCyte
  - Maintenance
  - Alignment
toc: false
---
 

The LCVR (liquid crystal variable retarder) on the TissueCyte regulates the laser power entering the system. 
It is the first non-mirror optical element in the path. 
The ThorLabs LCVR is very easily damaged: if the beam does not go straight through it, you risk toasting. 
A damaged LCVR will produce slow responses, intensity gradients across tiles, etc. 
This fact is not noted in the ThorLab's manual for the device.
The damage occurs when a powerful laser beam hits or scatters onto the edges of the LCVR holder. 
The holder is located inside a rotation stage and is protected by an aperture with a radius smaller than that of the LCVR itself.  
The aperture is *not* sufficient to protect the LCVR from damage.
i.e. if the beam swipes across its surface during alignment, you risk damaging the unit. 
The only safe way to re-align the beam through the LCVR is as follows:

- Block off the beam entering the device.
- Close the shutter integrated in the aperture in front of the LCVR.
- Unblock the beam and align it so that it hits the middle of the closed shutter.
- Block the beam.
- Open the LCVR shutter. 
- Un-block the beam.

At this point you must leave untouched the beam upstream of the LCVR.
