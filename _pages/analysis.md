---
permalink: /analysis/
title: "Analysing serial section data"
layout: splash
excerpt: "Sample registration and analysis"
toc: false
header:
  overlay_color: "#000"
  overlay_filter: "0.3"
  overlay_image: /assets/images/analysis/reg_banner.jpg
  actions:
    - label: "All repos"
      url: "https://github.com/orgs/SainsburyWellcomeCentre/teams/serial2p/repositories"

feature_row_ara_tools:
  - image_path: /assets/images/analysis/reg_coronal.jpg
    url: "https://github.com/SainsburyWellcomeCentre/ara_tools"
    alt: "MATLAB based registration"
    title: "Elastix-based registration"
    excerpt: 'Registering images in MATLAB using Elastix'
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_amap:
  - image_path:  /assets/images/analysis/NiftyReg_Logo.jpg
    alt: "NiftyReg Registration"
    title: "NiftyReg-based registration"
    excerpt: "Register brains using NiftyReg in Python"
    url: "https://github.com/brainglobe/brainreg"
    btn_label: "Repo"
    btn_class: "btn--primary"

feature_row_cellfinder:
  - image_path:  /assets/images/analysis/cellfinder-logo.jpg
    alt: "Automatic cell counting"
    title: "Automatic cell counting"
    excerpt: "Automatically count labelled cells with this cross-platform Python package"
    url: "https://github.com/SainsburyWellcomeCentre/cellfinder"
    btn_label: "Repo"
    btn_class: "btn--primary"

---

{% include feature_row id="feature_row_ara_tools"  type="left" %}
{% include feature_row id="feature_row_amap"       type="left" %}
{% include feature_row id="feature_row_cellfinder" type="left" %}

## Related tools
- [ClearMap](https://idisco.info/) - An Elastix/Python pipeline related to iDISCO
- [SimpleElastix](https://simpleelastix.github.io/) - A nice Elastix wrapper for multiple languages
- [BIRDS (pre-print)](https://www.biorxiv.org/content/10.1101/2020.06.30.181255v2)
- [Whole Brain Software](http://www.wholebrainsoftware.org/)
- [MelastiX](https://github.com/raacampbell/matlab_elastix) - Elastix wrapper for MATLAB. 
