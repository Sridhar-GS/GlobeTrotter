import json
import random
import os

# Constants
COUNTRIES = [
    {"name": "France", "cities": ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux", "Toulouse", "Strasbourg", "Montpellier", "Lille", "Rennes"]},
    {"name": "Japan", "cities": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo", "Fukuoka", "Nagoya", "Kobe", "Hiroshima", "Sendai"]},
    {"name": "USA", "cities": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]},
    {"name": "Italy", "cities": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"]},
    {"name": "Spain", "cities": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Murcia", "Palma", "Las Palmas", "Bilbao"]},
    {"name": "Germany", "cities": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"]},
    {"name": "UK", "cities": ["London", "Birmingham", "Manchester", "Glasgow", "Leeds", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Belfast"]},
    {"name": "Australia", "cities": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart"]},
    {"name": "Canada", "cities": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"]},
    {"name": "Brazil", "cities": ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"]},
]

ATTRACTION_TYPES = ["Museum", "Park", "Restaurant", "Landmark", "Shopping", "Nature", "Historical"]
ADJECTIVES = ["Ancient", "Modern", "Beautiful", "Grand", "Hidden", "Famous", "Secret", "Royal", "Golden", "Blue"]
NOUNS = ["Palace", "Garden", "Tower", "Bridge", "Square", "Market", "Temple", "Cathedral", "Castle", "Forest"]

def generate_cities():
    cities = []
    city_id_counter = 1
    
    # Real cities
    for country in COUNTRIES:
        for city_name in country["cities"]:
            cities.append({
                "id": city_id_counter,
                "name": city_name,
                "country": country["name"],
                "region": "Region of " + city_name,
                "cost_index": random.randint(1, 5),
                "popularity": random.randint(1, 100),
                "image_url": f"https://placehold.co/600x400?text={city_name}"
            })
            city_id_counter += 1
            
    # Generated cities to reach 1000
    remaining = 1000 - len(cities)
    for i in range(remaining):
        country = random.choice(COUNTRIES)["name"]
        name = f"{random.choice(ADJECTIVES)} City {i}"
        cities.append({
            "id": city_id_counter,
            "name": name,
            "country": country,
            "region": f"Region {random.randint(1, 20)}",
            "cost_index": random.randint(1, 5),
            "popularity": random.randint(1, 100),
            "image_url": f"https://placehold.co/600x400?text={name.replace(' ', '+')}"
        })
        city_id_counter += 1
        
    return cities

def generate_attractions(cities):
    attractions = []
    attraction_id_counter = 1
    
    for city in cities:
        num_attractions = random.randint(5, 10)
        for _ in range(num_attractions):
            name = f"{random.choice(ADJECTIVES)} {random.choice(NOUNS)}"
            attractions.append({
                "id": attraction_id_counter,
                "city_id": city["id"],
                "name": name,
                "type": random.choice(ATTRACTION_TYPES),
                "description": f"A {random.choice(ADJECTIVES).lower()} place to visit in {city['name']}.",
                "cost": round(random.uniform(0, 100), 2),
                "rating": round(random.uniform(3.0, 5.0), 1),
                "image_url": f"https://placehold.co/400x300?text={name.replace(' ', '+')}"
            })
            attraction_id_counter += 1
            
    return attractions

def main():
    print("Generating cities...")
    cities = generate_cities()
    
    print("Generating attractions...")
    attractions = generate_attractions(cities)
    
    output_dir = os.path.join(os.path.dirname(__file__), "../app/seed")
    os.makedirs(output_dir, exist_ok=True)
    
    with open(os.path.join(output_dir, "cities.json"), "w") as f:
        json.dump(cities, f, indent=2)
        
    with open(os.path.join(output_dir, "attractions.json"), "w") as f:
        json.dump(attractions, f, indent=2)
        
    print(f"Generated {len(cities)} cities and {len(attractions)} attractions.")

if __name__ == "__main__":
    main()
