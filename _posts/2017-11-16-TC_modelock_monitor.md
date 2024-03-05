---
title: "Stopping the TissueCyte on laser modelock failure"
excerpt: "Code and instructions for stopping the TissueCyte upon laser modelock failure"
author: robc
header:
  teaser: "/assets/images/posts/laserWithBeam_teaser.jpg"
categories:
  - Acquisition
tags: 
  - Hacks
  - TissueCyte
toc: false
---
 

![image-left]({{ site.baseurl }}/assets/images/posts/laserWithBeam.jpg){: .align-left} The laser on our TissueCyte proved unreliable and would every so often lose modelock (i.e. stop pulsing). 
No pulses means no two photon effect and so all acquired tiles are black. 
Very annoying, especially when it happens at 2am. 
TissueVision modified our version of Orchestrator to listen for a TTL signal on a defined digital line on the NI DAQ. 
I then wrote a little MATLAB GUI that periodically polls the laser over the serial interface and flips the TTL line to the TissueCyte NI DAQ when the laser goes off-line. 

The end result works fairly well: acquisition pauses when the pulses do. 
The only down-side is that after a couple of minutes of being paused Orchestrator will enter a time-out state and you will have to forcibly shut it down then re-start the acquisition. 
Still... could be worse. 
[The MATLAB GUI is here]({{ site.baseurl}}/assets/code/posts/modelock_alerter.tar.gz) (see help in the code for instructions). 
