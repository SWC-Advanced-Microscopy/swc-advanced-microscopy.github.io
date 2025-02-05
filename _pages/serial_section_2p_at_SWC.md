---
permalink: /serialSectionSWC/
title: "Serial Section Imaging at SWC"
layout: splash
excerpt: ""
toc: false
header:
  overlay_color: "#000"
  overlay_image: /assets/images/home/services_header.jpg
---
 

# What is serial section microscopy?
Serial section microscopy is used to image whole brains embedded in agar. The face of the block is alternately imaged and sliced until the whole sample has been acquired. The sections are generally discarded after the acquisition is complete. The system is not only a labour-saving device, but also produces high-quality 3D data without the distortions which occur when working with slides and manual sectioning. Registration of brains to the Allen Atlas is automated and works well for samples that are in good condition. 



# Using the equipment
If you are generating no more than about a brain a month or rarely have brains then it's probably best to have brains run for you by another person in your lab or by the Facility. Users expecting to regularly generate at least about 3 to 4 brains a month can be trained to run them independently on the serial section microscopes. Regardless of who runs your brains, you should have an intro session on the equipment and analysis approaches. There may be a long queue for training, so enquire well in advance. Feel free to shadow trained users from your lab, but will still need to be formally trained before using the equipment.

Initial training on the serial section systems takes about 10 hours: typically there are 5 training sessions spread across 3 or 4 days. Each session takes about 90 minutes plus another hour or two to discuss data handling and pre-processing (compressing data, transferring to server, registering, etc). You will need a minimum of 5 brains for initial training but we can get through up to about a dozen or so if you have them. After these initial sessions you will book the equipment yourself and run samples under supervision until you feel confident to run independently.

## How to sign up
1. Fill in the [training request form](https://docs.google.com/forms/d/1Xc7nAnFPY-WcHhVj3GPAydwgg4b32WIovKITfZiilkU/edit).
2. If you've not done so already, start an account on the [PPMS booking system](https://swcmicroscopy.com/faq/). 


## Before your first training session
* Brains **must be well perfused and undamaged**, or they will not register well to the atlas. See our [sample preparation notes and protocols](https://bakingtray.mouse.vision/users/sample_prep)
* Review the acquisition software [user guide](https://bakingtray.mouse.vision/users/user_guide) before your first training session.
* If you are unfamiliar with the Linux command line, please [read this guide](https://stitchit.mouse.vision/further-reading/useful-linux-commands) and try to get a little experience before training. You will need to use the command line to post-process your data.
* Once trained, book sessions via [PPMS](https://ppms.eu/ucl-swc/?Imaging). Expect that you will need about about 10 to 12 hours per brain for cell counting and about 6 to 8 hours for bulk projections or electrode tracks.



## Our equipment
We have three serial section systems:

* [BrainSaw 1](https://github.com/SWC-Advanced-Microscopy/swc-advanced-microscopy.github.io/wiki/BrainSaw-1)
* [BrainSaw 2 ("NeuroVision")](https://github.com/SWC-Advanced-Microscopy/swc-advanced-microscopy.github.io/wiki/BrainSaw-2-(%22NeuroVision%22))
* [BrainSaw 3 ("OrganGrinder")](https://github.com/SWC-Advanced-Microscopy/swc-advanced-microscopy.github.io/wiki/BrainSaw-3-(%22OrganGrinder%22))


# Citing
The serial section equipment in the facility are not yet associated with a methods paper. You can cite using DOIs for the software repositories:

* **BakingTray acquisition software**: [GitHub link](https://github.com/SWC-Advanced-Microscopy/BakingTray), [DOI](https://zenodo.org/badge/latestdoi/96208671)
* **StitchIt image assembly**: [GitHub link](https://github.com/SWC-Advanced-Microscopy/StitchIt), [DOI](https://zenodo.org/badge/latestdoi/57851444)

A reasonable way to write the methods would be:

"We imaged the brains using serial section ([Mayer 2008](https://doi.org/10.1111/j.1365-2818.2008.02024.x)) two-photon ([Ragan 2012](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3297424/)) microscopy. Our microscope was controlled by ScanImage Basic (MBF Bioscience) using BakingTray, a custom software wrapper for setting up the imaging parameters ([DOI](https://zenodo.org/badge/latestdoi/96208671)). Images were assembled using StitchIt ([DOI](https://zenodo.org/badge/latestdoi/57851444))."

