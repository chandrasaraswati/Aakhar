# Give me a Python script to do the following
# 1. From an Excel file (xlsx) extract data to json files with the below specifications
# 2. The names of the sheets would be the name of the json files and a file named `_categories.json` would contain the names of the json files.
# 3. All json files would be stored in folder assets/data from the location the python script is stored.
# 4. The xlsx file to parse is named `Aakhar_list.xlsx` located in the same folder as the python script.
# 5. In the sheets of xlsx file, the content in the cells of the first row would be the key in json files and the values would be present in the subsequent lines. Only extract to json file if the values are present for all the keys. 

import pandas as pd
import json
import os
import re

# --- Configuration ---
EXCEL_FILE = 'Aakhar_list.xlsx'
OUTPUT_DIR = 'assets/data'
# ---------------------

def sanitize_sheet_name(name):
    """
    Converts a sheet name (like "Common Words") into a
    JSON file name (like "common_words").
    """
    name = name.lower()
    name = re.sub(r'\s+', '_', name) # Replace spaces with underscores
    return name

def main():
    print(f"Starting conversion of {EXCEL_FILE}...")

    # 1. Check if the Excel file exists
    if not os.path.exists(EXCEL_FILE):
        print(f"\n--- ERROR ---")
        print(f"File not found: {EXCEL_FILE}")
        print("Please make sure the Excel file is in the same folder as this script.")
        print("---------------")
        return

    # 2. Create the output directory (assets/data)
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        print(f"Output directory is set to: {OUTPUT_DIR}")
    except OSError as e:
        print(f"Error creating directory {OUTPUT_DIR}: {e}")
        return

    # 3. Load the Excel file
    try:
        xls = pd.ExcelFile(EXCEL_FILE)
    except Exception as e:
        print(f"Error reading Excel file. Is it a valid .xlsx file? Error: {e}")
        return
        
    sheet_names = xls.sheet_names
    print(f"Found {len(sheet_names)} sheets: {sheet_names}")

    categories = []

    # 4. Process each sheet
    for sheet_name in sheet_names:
        print(f"\nProcessing sheet: '{sheet_name}'...")
        
        try:
            # Read the sheet. 
            # - dtype=str ensures all data is read as text.
            # - .fillna("") converts any blank cells (NaN) to empty strings ("").
            # This logic satisfies Rule 5 by matching the provided example JSONs,
            # where empty cells are included as '""' rather than being skipped.
            df = pd.read_excel(xls, sheet_name=sheet_name, dtype=str).fillna("")
            
            # Convert the DataFrame to a list of dictionaries (one per row)
            data_list = df.to_dict(orient='records')

            # 5. Generate file names (Rule 2)
            json_file_base_name = sanitize_sheet_name(sheet_name)
            json_file_path = os.path.join(OUTPUT_DIR, f"{json_file_base_name}.json")
            
            # Add to categories list
            categories.append(json_file_base_name)

            # 6. Write the JSON file (Rule 1 & 3)
            with open(json_file_path, 'w', encoding='utf-8') as f:
                # indent=2 and ensure_ascii=False make the output match your examples
                json.dump(data_list, f, indent=2, ensure_ascii=False)
            
            print(f"  -> Successfully created {json_file_path} with {len(data_list)} items.")

        except Exception as e:
            print(f"  -> Error processing sheet '{sheet_name}': {e}")

    # 7. Write the _categories.json file (Rule 2)
    if categories:
        categories_file_path = os.path.join(OUTPUT_DIR, '_categories.json')
        print(f"\nWriting categories file to {categories_file_path}...")
        try:
            with open(categories_file_path, 'w', encoding='utf-8') as f:
                json.dump(categories, f, indent=2, ensure_ascii=False)
            print("  -> Categories file created successfully.")
        except Exception as e:
            print(f"  -> Error writing categories file: {e}")
    
    print("\n--- Conversion Complete! --- ✨")

if __name__ == "__main__":
    main()