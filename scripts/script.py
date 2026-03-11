import csv
import json
import random
from datetime import datetime, timedelta

INPUT_FILE = "raw_data.csv"
OUTPUT_FILE = "../public/data.json"

LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"]

FIXED_FIELDS = {
    "id", "created_time", "ad_id", "ad_name", "adset_id", "adset_name",
    "campaign_id", "campaign_name", "form_id", "form_name", "is_organic",
    "platform", "lead_status"
}


def random_created_time():
    today = datetime.now().date()
    start = datetime(today.year, today.month, today.day) - timedelta(days=29)
    end = datetime(today.year, today.month, today.day, 23, 59, 59)
    total_seconds = (end - start).total_seconds()
    dt = start + timedelta(seconds=random.uniform(0, total_seconds))
    return dt.strftime("%Y-%m-%d_%H:%M:%S")


PLATFORM_MAP = {"fb": "facebook", "ig": "instagram"}

TEAM = [
    {"name": "Andrei Balan", "role": "CTO", "email": "andrei.balan@conversion-driven.com"},
    {"name": "Andrei Chirvase", "role": "CEO", "email": "andrei@conversion-driven.com"},
    {"name": "Roxana Chirvase", "role": "COO", "email": "roxana@conversion-driven.com"},
]

RO_PREFIXES = ["721", "722", "723", "724", "725", "726", "727", "728", "729",
               "731", "732", "733", "734", "735", "736", "737", "738", "739",
               "741", "742", "743", "744", "745", "746", "747", "748", "749",
               "751", "752", "753", "754", "755", "756", "757", "758", "759",
               "761", "762", "763", "764", "765", "766", "767", "768", "769",
               "771", "772", "773", "774", "775", "776", "777", "778", "779"]


def random_ro_phone():
    prefix = random.choice(RO_PREFIXES)
    suffix = "".join(str(random.randint(0, 9)) for _ in range(6))
    return f"+40{prefix}{suffix}"


def clean_value(key, value):
    v = value.strip()
    if key == "phone_number" and v.startswith("p:"):
        v = v[2:]
    return v


def transform(row, headers):
    lead_data = {}
    for h in headers:
        if h not in FIXED_FIELDS and row.get(h, "").strip():
            lead_data[h] = clean_value(h, row[h])

    raw_platform = row.get("platform", "").strip().lower()
    platform = PLATFORM_MAP.get(raw_platform, "organic")

    raw_id = row["id"].strip()
    if raw_id.startswith("l:"):
        raw_id = raw_id[2:]

    created_time = random_created_time()
    status = random.choice(LEAD_STATUSES)

    # Determine response_time
    has_response = status in ("CONTACTED", "QUALIFIED", "CONVERTED") or (
        status == "DISQUALIFIED" and random.random() < 0.5
    )
    if has_response:
        created_dt = datetime.strptime(created_time, "%Y-%m-%d_%H:%M:%S")
        offset = random.uniform(0, 7 * 24 * 3600)
        response_dt = created_dt + timedelta(seconds=offset)
        response_time = response_dt.strftime("%Y-%m-%d_%H:%M:%S")
    else:
        response_time = ""

    # 80% chance of 1x, remaining 20% split exponentially among 2x-5x
    # weights: 2x=8, 3x=4, 4x=2, 5x=1 → total=15, scaled to 20%
    r = random.random()
    if r < 0.80:
        returning_lead = "1x"
    elif r < 0.80 + 0.20 * (8 / 15):
        returning_lead = "2x"
    elif r < 0.80 + 0.20 * (12 / 15):
        returning_lead = "3x"
    elif r < 0.80 + 0.20 * (14 / 15):
        returning_lead = "4x"
    else:
        returning_lead = "5x"

    return {
        "id": raw_id,
        "created_time": created_time,
        "campaign_name": row.get("campaign_name", "").strip(),
        "platform": platform,
        "lead_data": lead_data,
        "lead_status": status,
        "response_time": response_time,
        "returning_lead": returning_lead,
        "assigned_to": {**random.choice(TEAM), "phone": random_ro_phone()},
    }


def main():
    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        results = [transform(row, headers) for row in reader]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"Done – {len(results)} leads written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()