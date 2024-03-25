
## README.md

### Virtuit Backend Services

This project encapsulates the backend functionalities for Virtuit Co., Ltd, focusing on automatically generating inquiry and offer tables, handling File operations, and providing health checks for server status.

### Installation & Setup

1. Ensure Python 3.x is installed on your machine.
2. Install required libraries using `pip`:
   ```bash
   pip install Flask PyMongo pandas matplotlib APScheduler
   ```
3. MongoDB should be installed and running on the default port (`localhost:27017`).

### Usage

#### Starting the Server

```bash
python app.py
```

#### Accessing Generated Tables and PDFs

Tables are accessible via:

- Offers Table: `GET /offers/table.png`
- Inquiries Table: `GET /inquiries/table.png`

Certificates of Analysis for offers can be fetched using:

- `GET /offer/coa/<order_id>.pdf`

#### Health Check

You can check if the server is properly running by accessing:

- `GET /api/v1/health`

### Contributing

Your contributions are welcome. Please fork the repository, make your changes, and submit a pull request.

### License

Specify the license under which this project is made available.

### Acknowledgments

Acknowledgments to the libraries and technologies used in this project.

---

This README provides a general introduction and guide on how to setup and interact with the Python code functionalities effectively. Further refinements may be necessary based on additional details or changes in the project requirements.  