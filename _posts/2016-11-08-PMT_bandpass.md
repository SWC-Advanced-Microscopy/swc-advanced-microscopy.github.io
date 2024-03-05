---
title: "Adding bandpass filters in front of the PMTs"
excerpt: "How to add band pass filters on the TissueCyte"
header:
  teaser: "/assets/images/home/GCamp6s_brain.jpg"
categories:
  - Acquisition
tags: 
  - Hacks
  - TissueCyte
toc: false
---
 

The PMTs sit in a metal unit that contains the high voltage power supply and the pre-amp. 
These are powered by 5V from a USB hub.
In front of the PMT is a collection lens and in front of that is a laser-blocking filter. 
The laser blocking filter is held in place by a ThorLabs SM2 lens tube with accessible external threads.
You can use these threads to attach a filter of you choice. 
There is no need for the filter to be SM2 (2 inches in diameter); one inch filters will do and are much cheaper.
The PMT active area is only 8 mm wide and we have verified that placing an empty 1 inch aperture over the laser blocking filter does not result in a decreased signal. 

You can buy the following parts from ThorLabs to build a filter holder for 1 inch mounted bandpass filters from Chroma or Semrock:

- 1x [**SM1A2**](https://www.thorlabs.com/thorproduct.cfm?partnumber=SM1A2) Adapter with External SM1 Threads and Internal SM2 Threads. This couples onto the outside surface of the PMT enclosure.

- 1x [**SM1M05**](https://www.thorlabs.com/thorproduct.cfm?partnumber=SM1M05) SM1 Lens Tube Without External Threads.
This is long enough to screw onto the SM1A2 and also accept the filter. The filter is held in by the retaining rings that come with this short SM1 tube.

- The following are optional caps. Buy them if you want to keep the filter in the housing when not in use.
1x [**SM1CP2**](https://www.thorlabs.com/thorproduct.cfm?partnumber=SM1CP2)  (Externally SM1-Threaded End Cap) and 1x [**SM2CP2**](https://www.thorlabs.com/thorproduct.cfm?partnumber=SM2CP2) - Externally SM2-Threaded End Cap.

If you do not already have one, an [**SPW606**](https://www.thorlabs.com/thorproduct.cfm?partnumber=SPW606) lens ring wrench (or one of the other longer ones) is very useful and will make it less likely you will damage your filters when assembling the holder.

### Assembly
- Remove one lens ring from the SM1M05 and then screw the SM1M05 into the SM1A2. Make sure it screws in all the way. 
- Screw the remaining lens ring down into the tube until it reaches the external threads of SM1A2. This will ensure your filter remains safe if someone later unscrews the SM1 tube from the SM1A2.
- Drop the filter carefully into the SM1 tube without touching the surface. Note the direction arrow on the edge. With Chroma filters, the arrow should point towards the sample. 
- One way of carefully inserting the filter is to place it on the small cardboard box it came with, arrow pointing towards the box. Over the filter with the SM1 tube then flip things over: the filter will drop safely into the tube. 
- Secure the filter with the remaining lens ring. 

### Installing the filter assembly
You can now screw the SM1A2 onto the external threads of the SM2 tube holding the PMT laser blocking filter. If installing on PMT 2 or PMT 3 (those near the vibrotome), you should first remove the blue/green dichroic before proceeding. This is mounted on a magnetic stand and easily comes away and is easily replaced once you're done. If you mount the assembly on PMT 1, you will need to remove the left panel of the enclosure but you won't need to remove the dichroic in front of PMT 1.