# Administrative Law Guide for Class

This repository contains a comprehensive study guide for Administrative Law, based on the course I took in Spring 2025. The guide provides detailed explanations of key concepts, case summaries, and visual aids to help students understand the complex doctrines of administrative law.

## Overview

The Administrative Law Guide is an interactive web-based resource that includes:

- Detailed explanations of fundamental administrative law doctrines
- Summaries of landmark cases with key facts, holdings, and reasoning
- Flowcharts and diagrams to visualize complex legal frameworks
- Interactive navigation between related concepts
- Exam preparation materials and practice questions

## Table of Contents

The guide is organized into the following main sections:

1. **Overview** - Introduction to administrative law and key concepts
2. **Part I: Introduction and Constitutionality** - Nondelegation, Major Questions Doctrine, Political Control
3. **Part II: Inside the Agency** - Rulemaking, Adjudication, APA Procedures
4. **Part III: Judicial Review** - Standards of Review, Chevron and Loper Bright, Arbitrary & Capricious
5. **Part IV: Access to Judicial Review** - Standing, Ripeness, Finality, Exhaustion
6. **Key Cases Guide** - Detailed summaries of landmark administrative law cases
7. **Exam Preparation** - Tips, strategies, and practice questions

## How to Use This Guide

### Running Locally (Recommended)

1. **Quick Start**: Double-click the `Launch_AdminLaw_Guide.bat` file to start the local web server and open the guide in your default browser.

2. **Manual Start**: Alternatively, you can open a command prompt and run:
   ```
   python server.py
   ```
   Then open your browser and navigate to `http://localhost:8000`

3. **Navigation**: Use the main navigation menu to jump between major sections, and use the section navigation within each page to move between topics.

### Requirements

- Python 3.x
- A modern web browser (Chrome, Firefox, Edge, or Safari)

### Troubleshooting

- **Python Not Found**: Ensure Python is installed and added to your PATH environment variable
- **Port Already in Use**: If port 8000 is already in use, you may need to close other applications or modify the PORT variable in server.py
- **Browser Doesn't Open**: Manually navigate to http://localhost:8000 in your web browser

## Features

- **Interactive Flowcharts**: The guide uses Mermaid.js to create interactive flowcharts that help visualize complex doctrinal frameworks
- **Case Boxes**: Detailed case summaries with facts, holdings, and reasoning
- **Color-Coded Sections**: Different colors for legislative, executive, and judicial concepts
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Print-Friendly**: Use the "Export to PDF" button to create a printable version of any section

## Customization

Feel free to customize this guide to suit your needs:

- Add new sections by creating HTML files in the `sections` directory
- Modify the CSS in `css/styles.css` to change the appearance
- Update case information as the law evolves

## Credit

This Administrative Law Guide was created specifically for students in Professor Hoopes' administrative law class. It is designed to complement the course materials and provide a resource for exam preparation.

## Disclaimer

This guide was not written by a lawyer and does not constitute legal advice. The content is intended for educational purposes only and should not be relied upon as authoritative legal guidance. Always consult with a qualified attorney for advice on specific legal matters.
