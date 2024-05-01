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



feature_row_brainsaw:
  - image_path: "https://raw.githubusercontent.com/wiki/SainsburyWellcomeCentre/StitchIt/images/rgb_brain_example.jpg"
    alt: "BrainSaw"
    title: "BrainSaw: automated serial-sectioning"
    excerpt: "We have three 'BrainSaw' automated serial section microscopes. Data are 
      acquired using [ScanImage](https://www.mbfbioscience.com/products/scanimage) and 
      [BakingTray](https://bakingtray.mouse.vision/). Each microscope can accommodate up to 6 
      brains, which are sliced and imaged together. Applications include mapping electrode 
      tracks, tracing bulk projections, and automated cell counting. 
      The systems have up to four channels and can generally handle up to four fluorophores simultaneously.

      * [Software User Guide](https://bakingtray.mouse.vision/users/user_guide){: .btn .btn--primary}
      "

feature_row_mesospim:
  - image_path:  /assets/images/equipment/mesoSPIM_swc_1_lowres.jpg
    alt: "MesoSPIM"
    title: "MesoSPIM: whole-brain lightsheet imaging"
    excerpt: "Pre-processes data during acquisition, streams the last stitched section to a web page, initiates stitching automatically when acquisition completes. Includes tools for downsampling and generally batch-processing image stacks. Operations highly parallelized for speed.

      * [Project website](https://mesospim.org){: .btn .btn--primary}
    "




feature_row_sp8:
  - image_path: https://www.leica-microsystems.com/fileadmin/global/products/Confocal/leica-sp8-mp-list.jpg
    alt: "Leica SP8 Confocal"
    title: "Leica SP8 Confocal"
    excerpt: "Our Leica SP8 confocal has a white light laser with software-tunable excitation filter and three software-tunable PMT channels. Leica's software is easy to use and comes with a slide-scanning extension.

    * [Microscope Details](https://github.com/SWC-Advanced-Microscopy/facility_webpage/wiki/Leica-SP8-Confocal){: .btn .btn--primary}
    "

feature_row_axioscan:
  - image_path: https://analyticalscience.wiley.com/do/10.1002/was.00020305/view-media-gallery/zeissaxioscan-13-4-2021-image1lr-1619004027613.jpg
    alt: "slide scanner"
    title: "Axioscan slide scanner"
    excerpt: "The Zeiss Axioscan slide scanner is a widefield microscope that accepts up to 100 slides and is able to image them largely automatically. We run this microscope alongside our histology service, but it can also be booked and used independently of this service.

    * [Microscope Details](https://github.com/SWC-Advanced-Microscopy/facility_webpage/wiki/Zeiss-Axioscan%E2%80%90Slidescanner){: .btn .btn--primary}
    "

feature_row_widefield:
  - image_path: /assets/images/equipment/axio-imager-2_apotome-3_system.jpg
    alt: "widefield microscopes"
    title: "Widefield microscopes"
    excerpt: "We have two [Zeiss Imagers](https://www.zeiss.com/microscopy/en/products/light-microscopes/widefield-microscopes/axio-imager-2-for-life-science-research.html), equipped with [Apotomes](https://www.zeiss.com/microscopy/en/products/light-microscopes/widefield-microscopes/apotome-3.html) for optical sectioning. 
      These microscopes are ideal for imaging small numbers of slides interactively. 
      We also have one [Zeiss Axiozoom](https://www.zeiss.com/microscopy/en/products/light-microscopes/stereo-and-zoom-microscopes/axio-zoom-v16-for-biology.html) for imaging larger fields of view.
      "

---

# Custom Equipment
{% include feature_row id="feature_row_brainsaw" type="left" %}
{% include feature_row id="feature_row_mesospim"   type="left" %}


## Commercial Systems
{% include feature_row id="feature_row_sp8" type="left" %} 
{% include feature_row id="feature_row_axioscan" type="left" %} 
{% include feature_row id="feature_row_widefield"   type="left" %}

