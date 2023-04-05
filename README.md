# mibi_tsai
The Tile/SED/Array Interface (TSAI) is a tool for rapidly setting up FOVs on the Ionpath Multiplexed Ion Beam Imaging (MIBI) microscope (MIBIscope).

## Table of Contents
- [1. Online version](#1-online-version)
- [2. Local installation](#2-local-installation)
- [3. Usage instructions](#3-usage-instructions)

## 1. Online version
The easiest way to use this tool is to open the working, online version at [https://tsai.stanford.edu/research/mibi_tsai](https://tsai.stanford.edu/research/mibi_tsai) on your MIBIscope computer. However, it contains presets which may not apply across all instruments. Thus, when using it you should **only** build from FOVs exported from your specific instrument's MIBIcontrol.

## 2. Local installation
If you wish to integrate your instrument's FOV presets as well as links to your MIBItracker and run log, you may set up a local installation on your MIBI computer hard drive (e.g. Desktop) or on any web host. There are no server-side commands in this version, thus no access to PHP, Python, SQL, etc. is required.

1. Use MIBIcontrol to create a `.json` file containing all your preset imaging modes and dwell times.
2. Download `mibi_tsai_standalone` to a new folder. Within the `_resources` subfolder, open `index.js` in any text editor.
3. Edit `tsai.url_run_log('');` to include your run log, e.g. `tsai.url_run_log('https://docs.google.com/spreadsheets/d/...');`.
4. Edit `tsai.url_mibi_tracker('');` to include your MIBItracker address, e.g. `tsai.url_mibi_tracker('https://your_lab.ionpath.com');`.
5. For each line `tsai.dwell_add('# ms', #);`, edit the dwell times and timing choices to match those in your .json file.
6. For each line `tsai.preset_add('...', {...});`, edit the preset names and FOV JSONs to match those in your .json file.
7. For each line `tsai.preset_recommended('...', [...]);`, edit the preset/dwell time combinations to match those recommended on your MIBIcontrol.
8. Uncomment (remove `//` from) and edit the various other presets to change the default style settings, e.g. line thickness or arrow key nudge distance.
9. Save your changes to `index.js`.
10. Open `index.html`.

## 3. Usage instructions
Screen capture videos will be submitted as part of a manuscript submission. Usage instructions will also be placed on on protocols.io if accepted.
