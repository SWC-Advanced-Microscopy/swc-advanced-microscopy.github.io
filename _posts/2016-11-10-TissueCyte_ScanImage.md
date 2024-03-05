---
title: "ScanImage on the TissueCyte"
excerpt: "How to run ScanImage on the TissueCyte"
author: robc
header:
  teaser: "/assets/images/home/GCamp6s_brain.jpg"
categories:
  - Acquisition
tags: 
  - Hacks
  - ScanImage
  - TissueCyte
toc: false
---
 
It is possible to acquire images with [ScanImage](http://scanimage.vidriotechnologies.com/display/SIH/ScanImage+Home) relatively easily and without making any significant changes to the existing acquisition hardware. 
ScanImage is helpful for maintenance tasks, such as measuring point spread functions with sub-micron beads. 
In addition, ScanImage has a rich API and much of the source code is publicly available.
The following modification is trivial to reverse but only allows ScanImage to run the scanners. 
You will need to set up [BakingTray](https://github.com/SainsburyWellcomeCentre/BakingTray) if you want to replace Orchestrator Vivace. 


### Preparing to run ScanImage
- We moved all the control hardware from a shelf suspended above the air table to a rack unit. This an afternoon's work but it's worth it:  both routine maintenance procedures and the ScanImage modification become a lot easier. 
- We added NI acquisition boards (see below) to our Windows 7 laser control PC. 
- We replaced the yellow Triax cables with regular BNC cables. The Triax cables aren't necessary: none of our *in vivo* two-photon rigs use them and we've noticed no ill effects having got rid of them on the TissueVision. We bought Triax to BNC adapters (like the [Keithley 7078-TRX-GND](https://www.google.com/search?q=Triax+to+BNC+Adapter,+7078-TRX-GND,+Keithley#q=Keithley+7078-TRX-GND)) for the three PMTs and the scanner box. 
- We added a BNC patch board that allows us to switch control of components between the machines running Orchestrator and the laser control PC running ScanImage. The BNC cables from the hardware (e.g. from the PMTs boxes, the scanner box, and the PIFOC) come into the back of the patch board. On the front we can either wire up the TissueVision acquisition machines or patch in the machine running ScanImage. 
- ScanImage will not use the X mirror feedback signal.  

### Rigs running at 120V
We are in the EU and had rigs running at 120v, which is not convenient. These we re-wired to accept 240 V. CAUTION: involves modifying mains power.
- The transformers have secondary windings that allow them to be switched to 240 V. Look up their model numbers on line and re-wire them. If you can't find this information, you shouldn't be performing this mod. 
- Unplug the 120V AC fan underneath the galvo heat sink. You can run without. 
- Replace the 120V MPS-80 PSU that powers the z-jack with a 240V version. Order from AMS directly. 
- Pay attention to the wiring of the motor control box. Ours had the neutral mains line going to the shield cable of the stepper motor (!). Remove that if so. We also had three mystery wires that went to the distribution rails and connected only to each other and nothing else. The box three a breaker in our room unless these were removed.


### Setting up ScanImage
- We used an [NI PCI-6110](http://sine.ni.com/nips/cds/view/p/lang/en/nid/11888) to run the scanners and acquire data from all three channels at a resolution of 12 bits.  
- We used an [NI PCIe-6321](http://sine.ni.com/nips/cds/view/p/lang/en/nid/207405) to run the PIFOC. This is optional.
- The latest version of ScanImage will work.

There are other options for the acquisition hardware. For more information, see the [cards supported by ScanImage](http://scanimage.vidriotechnologies.com/display/SI2016/Supported+Microscope+Hardware). One nice alternative is the 16 bit [PXIe-6124](http://sine.ni.com/nips/cds/view/p/lang/en/nid/206514) in a [PXIe-1073 chassis](http://sine.ni.com/nips/cds/view/p/lang/en/nid/207401) and [PXIe-6341](http://sine.ni.com/nips/cds/view/p/lang/en/nid/207415) if you want to control the PIFOC.

### Scan settings
The main scanning-related parameter you need to be aware of is the line period (the number of microseconds per scan line). When acquiring image stacks with Orchestrator, the fast scan axis runs with a line period of about 650 microseconds using a bidirectional scanning waveform. You can achieve this with ScanImage by modifying the sampling rate and the number of samples per pixel. Use the bidirectional setting and press the "auto" button to adjust the phase delay between the out-going and return lines. You need to be displaying one channel only for this to work. With line periods shorter than about 750 microseconds you will find that the phase delay can not be corrected across the entire line because it varies across the line. This is because the galvo controller PID loop can't keep up with the scanner. As the line period gets longer, this artifact goes away. It's essentially unnoticeable above 800 microseconds. However, since the artifact is consistent, you can run the system faster than this and correct the images *post hoc*. Here is the [the Machine Data File]({{ site.baseurl }}/assets/code/posts/SI_TC_datafile.m) we used.