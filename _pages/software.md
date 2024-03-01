---
permalink: /software/
title: "Software Tools"
layout: splash
excerpt: ""
toc: false
header:
  overlay_color: "#000"
  overlay_image: /assets/images/home/GCamp6s_brain.jpg
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

feature_row_brainrender:
  - image_path:  /assets/images/software/brain_render.jpg
    alt: "brainrender"
    title: "Visualisation: BrainRender"
    excerpt: "BrainRender was developed by Federico Claudi when he was in Tiago Branco's lab. Development has now been taken over by the SWC's neuroinformatics facility, with which the AMF is tightly linked. This Python-based package handles visualization of three dimensional neuroanatomical from publicly available datasets (e.g. Allen Brain atlas) and from user generated experimental data. The goal of brainrender is to facilitate the exploration and communication of neuroanatomical data by providing a user-friendly platform to create 3D renderings."
    url: "https://github.com/brainglobe/brainrender"
    btn_label: "Repo"
    btn_class: "btn--primary"

---

The AMF actively develops software tools related to microscope acquisition and behavior.
All tools are developed in the open and we are always happy to collaborate. 
Click our GitHub link, above, to see some of what we do. 
In addition to tools developed within the AMF, we collaborate with others to develop shared tools. Examples of collaborative work includes:


{% include feature_row id="feature_row_lasagna" type="left" %} 
{% include feature_row id="feature_row_scanning" type="left" %} 
{% include feature_row id="feature_row_brainrender" type="left" %}
{% include feature_row id="feature_row_masiv"   type="left" %}

