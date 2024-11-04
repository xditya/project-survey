# pip install pymongo matplotlib python-decouple pandas
from pymongo import MongoClient
import matplotlib.pyplot as plt
import pandas as pd
from collections import Counter
from decouple import config


def plot_pie(data):
    # Extract delay responses
    print_delays = [entry["printDelays"] for entry in data]
    slip_delays = [entry["slipDelays"] for entry in data]
    canteen_delays = [entry["canteenDelays"] for entry in data]

    # Count "yes" and "no" occurrences for each category
    print_counts = Counter(print_delays)
    slip_counts = Counter(slip_delays)
    canteen_counts = Counter(canteen_delays)

    # Define colors and explode for better visualization
    colors = {"yes": "#4CAF50", "no": "#FF5722"}  # Green for "yes", red for "no"
    explode = (0.05, 0)  # Slightly separate the "yes" section

    # Plot each pie chart separately
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))

    # Print Delays Pie Chart
    axes[0].pie(
        [print_counts["yes"], print_counts["no"]],
        labels=["Yes", "No"],
        autopct="%1.1f%%",
        startangle=140,
        colors=[colors["yes"], colors["no"]],
        explode=explode,
        wedgeprops=dict(edgecolor="w"),
    )
    axes[0].set_title("Print Delays", fontsize=16)

    # Slip Delays Pie Chart
    axes[1].pie(
        [slip_counts["yes"], slip_counts["no"]],
        labels=["Yes", "No"],
        autopct="%1.1f%%",
        startangle=140,
        colors=[colors["yes"], colors["no"]],
        explode=explode,
        wedgeprops=dict(edgecolor="w"),
    )
    axes[1].set_title("Slip Delays", fontsize=16)

    # Canteen Delays Pie Chart
    axes[2].pie(
        [canteen_counts["yes"], canteen_counts["no"]],
        labels=["Yes", "No"],
        autopct="%1.1f%%",
        startangle=140,
        colors=[colors["yes"], colors["no"]],
        explode=explode,
        wedgeprops=dict(edgecolor="w"),
    )
    axes[2].set_title("Canteen Delays", fontsize=16)

    # Adjust layout
    plt.tight_layout()
    plt.show()


def plot_histogram(data):
    # Convert to DataFrame for easy analysis
    df = pd.DataFrame(data)

    # Plot histogram for each rating type
    fig, axes = plt.subplots(1, 3, figsize=(15, 5), sharey=True)
    rating_types = ["printRating", "slipRating", "canteenRating"]
    for i, rating_type in enumerate(rating_types):
        counts = Counter(df[rating_type])
        axes[i].bar(counts.keys(), counts.values(), color="skyblue")
        axes[i].set_title(f"{rating_type}")
        axes[i].set_xlabel("Rating")
        axes[i].set_ylabel("Frequency")
        axes[i].set_xticks(range(1, 6))

    plt.tight_layout()
    plt.show()


def main():
    client = MongoClient(config("MONGODB_URI"))

    db = client["campus_survey"]

    responses = db["surveys"]

    # get all the responses
    all_responses = responses.find()

    data = list(all_responses)

    plot_pie(data)
    plot_histogram(data)


main()
