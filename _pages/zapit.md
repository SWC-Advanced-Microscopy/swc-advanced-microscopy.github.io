---
permalink: /zapit/
title: "Zapit"
layout: single
excerpt: "Random-access photostimulation"
toc: false
header:
  overlay_color: "#000"
  overlay_filter: "0.4"
  overlay_image: /assets/images/zapit/zapit_waveforms_banner.jpg
  actions:
    - label: "GitHub"
      url: "https://github.com/zapit-optostim/"
---


Zapit is point-based (scanner-based) optostimulator system for head-fixed mouse behavioral tasks. 
The system can photostimulate near-simultaneously up to 20 locations on the dorsal brain surface.
The software will run on a variety of hardware designs and experimental paradigms. 
A user-friendly MATLAB GUI handles creation of stimulus sets, scanner calibration, and alignment of stereotaxic coordinates to the sample. 
The experiment itself is run via a MATLAB API: using a small number of simple commands the user can initiate and stop optostimulation, and handle trial logging to disk. There is a Python wrapper for the MATLAB API and support for presenting stimuli in other programming languages. 

Zapit is a collaboration between the AMF and several SWC labs. 
We have a [bioRxiv pre-print](https://doi.org/10.1101/2024.02.12.579892) and the project is fully available on [GitHub](https://github.com/Zapit-Optostim). 
