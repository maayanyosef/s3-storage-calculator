# AWS S3 Storage Cost Calculator

This project is a web-based calculator for estimating AWS S3 storage costs based on different storage tiers and operations. It provides an easy-to-use interface for selecting storage tiers, inputting storage sizes, and estimating the cost of various S3 operations like PUT, GET, and data retrieval requests.

## Features

- **Storage Tier Options**: Supports multiple S3 storage classes, including:
  - S3 Standard
  - S3 Standard-IA (Infrequent Access)
  - S3 One Zone-IA
  - S3 Glacier Instant Retrieval
  - S3 Glacier Flexible Retrieval
  - S3 Glacier Deep Archive
- **Cost Estimation**: Calculates estimated monthly costs based on the provided inputs.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **User-Friendly**: Simple and clean interface for users to quickly input data and get cost estimates.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of AWS S3 operations and storage tiers

##  Usage
Select the S3 storage tier from the provided dropdowns.
Input the size of the storage and the number of requests (PUT, GET, etc.).
The estimated monthly cost will be displayed in the rightmost column.

##  Technologies Used
* HTML/CSS for the front-end structure and styling.
* JavaScript for handling user input and calculating the cost.
* Bootstrap for layout and responsive design.

## Contributing
Feel free to submit pull requests or report issues. Contributions to improve the UI, add new features, or optimize calculations are welcome!

## License
This project is licensed under the MIT License. See the LICENSE file for more information.

**Note**: AWS pricing may vary by region and is subject to change. The calculator uses example rates as of September 2021. For the most accurate and up-to-date pricing, refer to the official [AWS S3 Pricing Page](https://aws.amazon.com/s3/pricing/).