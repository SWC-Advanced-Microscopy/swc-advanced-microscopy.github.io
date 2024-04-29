---
permalink: /equipment/
title: "Equipment"
layout: splash
excerpt: ""
toc: false
header:
  overlay_color: "#000"
  overlay_image: /assets/images/home/tools_header.jpg
  actions:
    - label: "AMF GitHub"
      url: "https://github.com/orgs/SWC-Advanced-Microscopy/repositories"

feature_row_lasagna:
  - image_path: /assets/images/software/Lasagna.jpg
    url: "https://github.com/SainsburyWellcomeCentre/lasagna"
    alt: "Lasagna"
    title: "Visualisation: Lasagna"
    excerpt: "This Python-based software was originally developed by Rob Campbell for a project with Tom Mrsic-Flogel's lab, but is now being used by the IBL consortium to trace electrode tracks. It provides linked orthogonal 2-D views for fast visualisation of downsampled image stacks. Allows overlays of multiple brains, multiple channels, traced neurites, or soma locations. Includes viewer for Allen Atlas and is extendable via plugins. Lasagna pre-dates napari, which we would recommend for new projects"
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_scanning:
  - image_path: /assets/images/software/simple_mscanner.jpg
    url: "https://github.com/SWC-Advanced-Microscopy/SimpleMScanner"
    alt: "simple_mscanner"
    title: "Data Acquisition: SimpleMScanner"
    excerpt: "This MATLAB software was written by Rob Campbell for teaching purposes. It runs galvo-based scanning microscopy using NI Hardware. The project includes three increasingly complicated versions of the same program. An equivalent Python project [can be found here](https://github.com/SWC-Advanced-Microscopy/SimplePyScanner).
      This code can any scanning based microscope, from a simple transmission-based system to a 2-photon."
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_masiv:
  - image_path:  /assets/images/software/masiv.jpg
    alt: "MaSIV"
    title: "Visualisation: MaSIV"
    excerpt: "This MATLAB-based package was developed by Alex Brown in Troy Margrie's lab. MaSIV is a simple multi-resolution image viewer: it loads a small downsampled image stack into RAM but presents the user with full-res data as they zoom in. MaSIV is stable but can only display a single channel at once. It is extendable via plugins, some of which were written by AMF members."
    url: "https://github.com/SainsburyWellcomeCentre/masiv"
    btn_label: "Repo"
    btn_class: "btn--primary"

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


feature_row_zapit:
  - image_path:  /assets/images/zapit/zapit_mouse_laser.jpg
    alt: "Zapit Optogenetics"
    title: "Zapit: random-access optogenetics"
    excerpt: "Zapit is point-based (scanner-based) optostimulator system for head-fixed mouse behavioral tasks. The software will run on a variety of hardware designs and experimental paradigms. A user-friendly MATLAB GUI handles creation of stimulus sets, scanner calibration, and alignment of stereotaxic coordinates to the sample. The experiment itself is run via a MATLAB API: using a small number of simple commands the user can initiate and stop optostimulation, and handle trial logging to disk. There is a Python wrapper for the MATLAB API and support for presenting stimuli in other programming languages. 
      Zapit is a collaboration between the AMF and several SWC labs. Click [HERE](https://doi.org/10.1101/2024.02.12.579892) to read our pre-print."
    url: "https://github.com/zapit-optostim/"
    btn_label: "Repo"
    btn_class: "btn--primary"

---

## Acquisition Pipelines

The technology is spread beyond the SWC in two ways. Firstly, we image samples for external collaborators: for example, over the last 5 years we have imaged about 1100 brains for the International Brain Laboratory. Secondly, I have helped external groups build their own serial section systems. To date, 8 systems have been built outside of the SWC, 3 more are currently under construction, and a further 6 are under discussion. A serial section 2-photon system represents a significant investment and so the fact that my system is being embraced by so many external collaborators speaks to its quality and ease of use. Microscopes built by external collaborators have so far resulted in 10 publications. 



{% include feature_row id="feature_row_bakingtray" type="left" %}
{% include feature_row id="feature_row_stitchit"   type="left" %}

## Custom Projects
{% include feature_row id="feature_row_zapit" type="left" %} 


## Software Tools
{% include feature_row id="feature_row_lasagna" type="left" %} 
{% include feature_row id="feature_row_scanning" type="left" %} 
{% include feature_row id="feature_row_masiv"   type="left" %}

