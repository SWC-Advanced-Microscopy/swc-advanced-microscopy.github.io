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
    url: "https://bakingtray.mouse.vision"
    alt: "BrainSaw"
    title: "BrainSaw: automated serial-sectioning"
    excerpt: "We have three 'BrainSaw' automated serial section microscopes. Each microscope can accommodate up to 6 brains, which are sliced and imaged together. Applications include mapping electrode tracks, tracing bulk projections, and automated cell counting. The systems have up to four channels and can generally handle up to four fluorophores simultaneously."
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_mesospim:
  - image_path:  /assets/images/serialsection/stitching.jpg
    alt: "MesoSPIM"
    title: "MesoSPIM: whole-brain lightsheet imaging"
    excerpt: "Pre-processes data during acquisition, streams the last stitched section to a web page, initiates stitching automatically when acquisition completes. Includes tools for downsampling and generally batch-processing image stacks. Operations highly parallelized for speed."
    url: "https://github.com/SWC-Advanced-Microscopy/StitchIt"
    btn_label: "Repo"
    btn_class: "btn--primary"



feature_row_sp8:
  - image_path: /assets/images/software/Lasagna.jpg
    url: "https://github.com/SainsburyWellcomeCentre/lasagna"
    alt: "Leica SP8 Confocal"
    title: "Leica SP8 Confocal"
    excerpt: "This Python-based software was originally developed by Rob Campbell for a project with Tom Mrsic-Flogel's lab, but is now being used by the IBL consortium to trace electrode tracks. It provides linked orthogonal 2-D views for fast visualisation of downsampled image stacks. Allows overlays of multiple brains, multiple channels, traced neurites, or soma locations. Includes viewer for Allen Atlas and is extendable via plugins. Lasagna pre-dates napari, which we would recommend for new projects"
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_axioscan:
  - image_path: /assets/images/software/simple_mscanner.jpg
    url: "https://github.com/SWC-Advanced-Microscopy/SimpleMScanner"
    alt: "slide scanner"
    title: "Axioscan slide scanner"
    excerpt: "This MATLAB software was written by Rob Campbell for teaching purposes. It runs galvo-based scanning microscopy using NI Hardware. The project includes three increasingly complicated versions of the same program. An equivalent Python project [can be found here](https://github.com/SWC-Advanced-Microscopy/SimplePyScanner).
      This code can any scanning based microscope, from a simple transmission-based system to a 2-photon."
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_widefield:
  - image_path:  /assets/images/software/masiv.jpg
    alt: "widefield microscopes"
    title: "Widefield microscopes"
    excerpt: "This MATLAB-based package was developed by Alex Brown in Troy Margrie's lab. MaSIV is a simple multi-resolution image viewer: it loads a small downsampled image stack into RAM but presents the user with full-res data as they zoom in. MaSIV is stable but can only display a single channel at once. It is extendable via plugins, some of which were written by AMF members."
    url: "https://github.com/SainsburyWellcomeCentre/masiv"
    btn_label: "Repo"
    btn_class: "btn--primary"




---

# Custom Equipment

The AMF specialises in custom high throughput imaging using custom equipment. 

The technology is spread beyond the SWC in two ways. Firstly, we image samples for external collaborators: for example, over the last 5 years we have imaged about 1100 brains for the International Brain Laboratory. Secondly, I have helped external groups build their own serial section systems. To date, 8 systems have been built outside of the SWC, 3 more are currently under construction, and a further 6 are under discussion. A serial section 2-photon system represents a significant investment and so the fact that my system is being embraced by so many external collaborators speaks to its quality and ease of use. Microscopes built by external collaborators have so far resulted in 10 publications. 



{% include feature_row id="feature_row_brainsaw" type="left" %}
{% include feature_row id="feature_row_mesospim"   type="left" %}


## Commercial Systems
{% include feature_row id="feature_row_sp8" type="left" %} 
{% include feature_row id="feature_row_axioscan" type="left" %} 
{% include feature_row id="feature_row_widefield"   type="left" %}

