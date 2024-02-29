---
permalink: /visualisation/
title: "Visualising Data"
layout: splash
excerpt: "MATLAB and Python tools for visualising raw data"
toc: false
header:
  overlay_color: "#000"
  overlay_filter: "0.3"
  overlay_image: /assets/images/acquisition/rgb_brain_banner.jpg
  actions:
    - label: "All repos"
      url: "https://github.com/orgs/SainsburyWellcomeCentre/teams/serial2p/repositories"

feature_row_lasagna:
  - image_path: /assets/images/home/Lasagna.jpg
    url: "https://github.com/SainsburyWellcomeCentre/lasagna"
    alt: "Lasagna"
    title: "Visualisation: Lasagna"
    excerpt: "This Python-based software is currently under development. It provides three linked orthogonal 2-D views for fast visualisation of downsampled image stacks. Allows overlays of multiple brains, multiple channels, traced neurites, or soma locations. Includes viewer for Allen Atlas. Extendable via plugins."
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_masiv:
  - image_path:  /assets/images/home/masiv.jpg
    alt: "MaSIV"
    title: "Visualisation: MaSIV"
    excerpt: "This MATLAB-based package loads downsampled image stacks but presents the user with full-res data as they zoom in. MaSIV is stable but can only display a single channel at once. Extendable via plugins."
    url: "https://github.com/SainsburyWellcomeCentre/masiv"
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_brainrender:
  - image_path:  /assets/images/home/brain_render.jpg
    alt: "brainrender"
    title: "Visualisation: BrainRender"
    excerpt: "This Python-based package handles visualization of three dimensional neuroanatomical from publicly available datasets (e.g. Allen Brain atlas) and from user generated experimental data. The goal of brainrender is to faciliate the exploration and communication of neuroanatomical data by providing a user-friendly platform to create 3D renderings."
    url: "https://github.com/BrancoLab/BrainRender"
    btn_label: "Repo"
    btn_class: "btn--primary"

---

{% include feature_row id="feature_row_brainrender" type="left" %}
{% include feature_row id="feature_row_masiv"   type="left" %}
{% include feature_row id="feature_row_lasagna" type="left" %}


## Links
- [Napari](https://napari.org/) - Fast visualisation of big image data in Python
- [Fiji](https://fiji.sc/) - You can use virtual stacks or the BigDataViewer to navigate large datasets
- [Icy](http://icy.bioimageanalysis.org/) - Fiji alternative
- [ClearVolume](https://imagej.net/ClearVolume) - Fiji plugin for making pretty transparent volumes.
- [spimagine](https://github.com/maweigert/spimagine) - Volume renderer
- [Fluorender](http://www.sci.utah.edu/software/fluorender.html) - 3D volume renderer aimed at neuroscientists. Probably can't handle large datasets.
- [VAA3D](http://home.penglab.com/proj/vaa3d/home/index.html) - Multi-dimensional data viewer for big datasets. Can be hard to set up but is powerful.
- [MIB](http://mib.helsinki.fi/index.html) - General purpose MATLAB-based viewer for quick visualisations. No big data options. 
- [Knossos](https://knossos.app/) - Big data image annotator
- [Orbit](http://www.orbit.bio/) - Image analysis tool
- [Free Imaris Viewer](https://imaris.oxinst.com/imaris-viewer) - Imaris now have a stripped down version that is free