# ☀️ PV Power Plant Calculation (Google Sheets Template)

An interactive Google Sheets template for performing PV (solar) power plant feasibility calculations. It includes automated solar irradiation data retrieval from NASA, a visual location picker via OpenStreetMap, and battery sizing simulation logic.

> **📋 Use the Template**:  
> Copy the spreadsheet directly from this link:  
> [📎 PV Power Plant Calculator Template (Google Sheets)](https://docs.google.com/spreadsheets/d/1cYo_bQZ9E5Ke_ufEMswpMPYUxu_eVLQPYA2kUa59hIY/edit?usp=sharing)

---

## 🚀 Features

### 📍 Visual Location Selection (OpenStreetMap)
- Interactive map pop-up using Leaflet + OSM.
- Click anywhere on the map to automatically fill latitude (`E9`) and longitude (`H9`) into the `Overview` sheet.
- This triggers automatic retrieval of solar radiation (GHI) data.

**🔘 Button on `Overview` sheet:**
- **Label**: `Maps`
- **Assigned Script**: `showOSMMapDialog`

---

### ☀️ Automatic GHI Data Fetch from NASA POWER
- Fetches daily **Global Horizontal Irradiance (GHI)** for the entire previous year using NASA's POWER API.
- Data is inserted into the `Data Source` sheet.
- Missing values (`-999`) are automatically replaced with the previous valid value.

---

### 🔋 Battery Sizing Simulation
- Simulate various battery capacities based on user-defined min/max/step values.
- For each capacity, it calculates:
  - PLN (grid) import
  - Percentage of PLN usage
- Results are shown in columns `M:N:O` starting from row 9 of the `Battery Calculation` sheet.

**🔘 Button on `Battery Calculation` sheet:**
- **Label**: `Refresh`
- **Assigned Script**: `simulateBatterySizing`

---

## 🧰 File Structure

| File             | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `Code.gs`        | Main Apps Script code for data fetching, sheet interaction, and simulation |
| `OSMMap.html`    | Embedded HTML for the location picker dialog using Leaflet + OSM           |
| `README.md`      | This documentation                                                         |

---

## 🌐 External APIs Used

- **NASA POWER API** – for solar irradiation (GHI) data  
- **OpenStreetMap + Leaflet.js** – for selecting location via interactive map

---

## 📌 Notes

- Make sure latitude & longitude fields (`E9`, `H9` in `Overview`) are filled before triggering the GHI fetch.
- `simulateBatterySizing()` depends on formula-based logic in cell `M2` to estimate energy performance for each battery size.
- The system automatically reverts the original formula in `M2` after the simulation loop.

---

## 📸 Screenshot

![image](https://github.com/user-attachments/assets/6104aabe-fde8-4d70-ae98-7e2fd6b7c35f)
![image](https://github.com/user-attachments/assets/d4441de7-7e40-40af-9cd8-591b3c73f27e)


---

## 🪪 License

This project is open-source and free to use for educational and commercial use cases. Feel free to extend or customize based on your project needs.

---

Enjoy optimizing your solar energy project! ☀️🔋
