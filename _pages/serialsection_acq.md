---
permalink: /ss_acquisition/
title: "Image Acquisition and Stitching"
layout: splash
excerpt: "Open tools for acquiring and stitching serial section data"
toc: false
header:
  overlay_color: "#000"
  overlay_filter: "0.3"
  overlay_image: /assets/images/serialsection/rgb_brain_banner.jpg


feature_row_bakingtray:
  - image_path: "https://raw.githubusercontent.com/wiki/SainsburyWellcomeCentre/StitchIt/images/rgb_brain_example.jpg"
    url: "https://bakingtray.mouse.vision"
    alt: "Acquisition of raw data"
    title: "BakingTray: serial-section acquisition software"
    excerpt: "BakingTray is modular serial-section acquisition software for MATLAB. It can easily be modified to utilize any desired acquisition hardware (scanners, stages, etc). Images are currently acquired with ScanImage, but BakingTray can easily be extended to work with any acquisition system (e.g. a spinning-disk confocal or your own scanning software). BakingTray is more of a research platform for catalyzing developments in serial section imaging than a complete turn-key system."
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_stitchit:
  - image_path:  /assets/images/serialsection/stitching.jpg
    alt: "Stitching"
    title: "StitchIt: assembling tile scan data to stitched sections"
    excerpt: "Pre-processes data during acquisition, streams the last stitched section to a web page, initiates stitching automatically when acquisition completes. Includes tools for downsampling and generally batch-processing image stacks. Operations highly parallelized for speed."
    url: "https://github.com/SWC-Advanced-Microscopy/StitchIt"
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_brainglobe:
  - image_path:  /assets/images/software/brain_render.jpg
    alt: "brainrender"
    title: "Analysis: BrainGlobe"
    excerpt: "Our favoured option for analysis of serial section data is the BrainGlobe suite.
             These Python-based tools were developed by researchers within the SWC and are now managed by a [dedicated team of software engineers](https://neuroinformatics.dev/). 
             BrainGlobe comprises several software packages to access, analyze and visualize anatomical data. 
             The packages are interoperable in order to streamline the process of going from raw data to publication-ready content."
    url: "https://brainglobe.info/"
    btn_label: "Repo"
    btn_class: "btn--primary"


---

{% include feature_row id="feature_row_bakingtray" type="left" %}
{% include feature_row id="feature_row_stitchit"   type="left" %}
{% include feature_row id="feature_row_brainglobe"   type="left" %}


## Open tools by others
- [TeraVoxel resonant-scanning serial section 2p](https://elifesciences.org/articles/10566) and [GitHub page](https://github.com/TeravoxelTwoPhotonTomography). See also [MouseLight](https://github.com/MouseLightPipeline) and paper by [Winnubst, et al. (2019)](https://www.sciencedirect.com/science/article/pii/S0092867419308426?via%3Dihub).
- [FAST serial section spinning disk confocal](https://www.nature.com/articles/s41596-019-0148-4)
