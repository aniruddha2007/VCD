import re

def extract_info(text):
    category = re.search(r"(Inquiry|Offer)", text).group()
    gar_range = [int(x[3:]) for x in re.findall(r"GCV(\d+|\d+\-\d+)", text)]
    ash_range = [int(x.split()[-1]) for x in re.findall(r"low\sash\s(\d+)", text)]
    volume_range = []
    volume_matches = re.findall(r"(\d+-\d+|[0-9]+)MT", text)
    for match in volume_matches:
        parts = match.split("-")
        if len(parts) == 2:
            volume_range.extend([int(parts[0]), int(parts[1])])
        else:
            volume_range.append(int(match[:-2]))
    laycan_date = re.search(r"end\s+of\s+[A-Za-z]+\s+loading", text)
    if laycan_date:
        laycan_date = laycan_date.group().split("loading")[0].strip()
    else:
        laycan_date = None
    port_match = re.search(r"[A-Za-z]+\s+(?=GCV)", text)
    port = port_match.group().strip() if port_match else None  # Extracts city/country before "GCV" if found
    return category, gar_range, ash_range, volume_range, laycan_date, port

texts = ["Inquiry GCV5500 low sulfur low ash 60000-80000MT end of May loading Indonesia.",
          "Offer GCV4200-4000 ash 6 120000MT laycan: H2 Apr Australia.",
          "Inquiry GCV4800 low sulfur low ash 70000-90000MT end of June loading Germany.",
          "Offer GCV3800-3600 ash 7 80000MT laycan: H1 Mar India.",
          "Inquiry GCV6000 low sulfur low ash 50000-70000MT end of July loading China.",
          "Offer GCV4000-3800 ash 5 150000MT laycan: H2Apr Taiwan.",
          "Inquiry GCV5300 low sulfur low ash 60000-80000MT end of August loading Russia.",
          "Offer GCV3500-3300 ash 6 100000MT laycan: H1 Mar France.",
          "Inquiry GCV5700 low sulfur low ash 70000-90000MT end of September loading Indonesia.",
          "Offer GCV4200-4000 ash 7 120000MT laycan: H2 Apr Brazil."]

for text in texts:
    category, gar_range, ash_range, volume_range, laycan_date, port = extract_info(text)
    print(f"Category: {category}")
    print(f"GAR range: {gar_range}")
    print(f"Ash range: {ash_range}")
    print(f"Volume range: {volume_range}")
    print(f"Laycan date: {laycan_date}")
    print(f"Port: {port}\n")
