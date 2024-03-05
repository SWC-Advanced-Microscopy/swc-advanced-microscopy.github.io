---
title: "Measuring X/Y resolution"
excerpt: "How to measure the FOV size and so derive the number of microns per pixel"
header:
  teaser: "/assets/images/home/GCamp6s_brain.jpg"
categories:
  - Acquisition
tags: 
  - Maintenance
toc: false
---


 You can measure the number of microns per pixel using an EM grid and the following protocol.

- Acquire grids 2145C from [2spi.com](http://www.2spi.com/item/2145c-xa/).
These grids have a pitch of 25 microns, a hole width of 19 microns and a bar width of 6 microns.
Measurements using the stages on one of our *in vivo* scopes confirm this. 
- Place one grid on a microscope slid and seal it with a coverslip. 
- You will see fluorescence from the naked copper grid with an excitation wavelength of 920 nm. Use very low power. e.g. 3 mW. 
- The grid should be oriented so that it's aligned relatively closely with the scan axes. It will help to look at the slide under a dissection scope and draw a line on the slide to indicate the grid orientation. 
- Take an image and, if you like, use the Grid2MicsPerPixel.m function at [measurePSF](https://github.com/raacampbell/measurePSF) to measure x/y resolution. Make sure to read the help for that function if you use it. It's important that the function identifies all the grid lines for you to get an accurate measurement. 

You can also use the grid to ensure that the scanners are orthogonal to each other. 
For this you will need to measure the angle of the grid lines with respect to each other. 
You could do this with the line tool in [Icy](http://icy.bioimageanalysis.org/), for example, then export the data to MATLAB and calculate the angles. 


