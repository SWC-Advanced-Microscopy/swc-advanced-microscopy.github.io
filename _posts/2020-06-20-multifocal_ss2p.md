---
title: "Multi-focal serial-section 2-photon imaging"
excerpt: "Super-fast serial section imaging by multiplexing"
header:
  teaser: "/assets/images/posts/chen_teaser_2020.jpg"
categories:
  - Acquisition
tags: 
  - News
toc: false
---

This [recent pre-print](https://www.biorxiv.org/content/10.1101/2020.06.11.146704v2) by David Chen in the Myers lab describes a new serial-section 2p design (2p-COMB) which uses a multi-anode PMT to allow multi-plexed data acquistion. A beam splitter creates a linear array of 16 beams, which are scanned over the sample. The emitted fluorescence is de-scanned along one axis by a galvo and imaged onto a 16-anode PMT. This results in frames rates of over 450 FPS. A volume ~5 mm × 7 mm × 3 mm can imaged in about 11 hours. 

<figure>
        <img width="400px" src="{{ site.baseurl }}/assets/images/posts/2p-COMB-path.png" >
</figure>

To help reduce noise caused by the low SNR of the short dwell-time data, the authors employed content-aware image restoration (CARE)

<figure>
        <img width="400px" src="{{ site.baseurl }}/assets/images/posts/Chen_CARE.png" >
</figure>