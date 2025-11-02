import pandas as pd
import os
import re
from pathlib import Path

def create_clean_filename(sheet_name):
    """Converts a sheet name into a clean, snake_case JSON filename."""
    # Remove any non-alphanumeric characters except spaces
    s = re.sub(r'[^a-zA-Z0-9 ]', '', sheet_name)
    # Replace spaces with underscores and convert to lowercase
    return s.strip().replace(' ', '_').lower() + '.json'

def convert_excel_to_json(excel_file, output_dir):
    """
    Reads all sheets from an Excel file and saves each one as a
    separate JSON file in the output directory.
    
    The JSON is saved in a 'records' orientation (a list of objects).
    """
    
    # --- 1. Create Output Directory ---
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Output directory '{output_path.resolve()}' is ready.\n")

    # --- 2. Load Excel File ---
    try:
        xls = pd.ExcelFile(excel_file)
    except FileNotFoundError:
        print(f"ERROR: File not found at '{excel_file}'")
        print("Please make sure the file is in the same directory as the script.")
        return
    except Exception as e:
        print(f"ERROR: Could not read Excel file. Is 'openpyxl' installed?")
        print(f"Details: {e}")
        return

    print(f"Successfully loaded '{excel_file}'. Found {len(xls.sheet_names)} sheet(s).")

    # --- 3. Process Each Sheet ---
    for sheet_name in xls.sheet_names:
        print(f"Processing sheet: '{sheet_name}'...")
        
        try:
            # Read the sheet. 
            # keep_default_na=False tells pandas *not* to treat "N/A" as a NaN (Not a Number) value.
            # This ensures "N/A" is kept as a string.
            df = pd.read_excel(xls, sheet_name=sheet_name, keep_default_na=False)
            
            # --- 4. Generate Filename and Save JSON ---
            json_filename = create_clean_filename(sheet_name)
            json_filepath = output_path / json_filename
            
            # Save to JSON in 'records' format: [ {col: val}, {col: val}, ... ]
            df.to_json(json_filepath, orient='records', force_ascii=False, indent=2)
            
            print(f"  -> Successfully saved to '{json_filepath.name}'\n")

        except Exception as e:
            print(f"  -> ERROR: Could not process sheet '{sheet_name}'.")
            print(f"     Details: {e}\n")

    print("Conversion complete.")

# --- Configuration ---
# Your main Excel file
EXCEL_FILENAME = 'Aakhar_list.xlsx' 

# The folder where you want the JSON files to be saved
# This is perfect for your SvelteKit project's 'static' folder
OUTPUT_JSON_DIR = 'static/data' 

# --- Run the Script ---
if __name__ == "__main__":
    # Check for pandas and openpyxl
    try:
        pd
    except NameError:
        print("ERROR: 'pandas' library not found.")
        print("Please install it by running: pip install pandas")
        exit()
        
    try:
        import openpyxl
    except ImportError:
        print("ERROR: 'openpyxl' library not found.")
        print("This is required for reading .xlsx files.")
        print("Please install it by running: pip install openpyxl")
        exit()

    convert_excel_to_json(EXCEL_FILENAME, OUTPUT_JSON_DIR)
