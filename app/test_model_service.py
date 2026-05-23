from model_service import predict_investment, recommend_games

prediction = predict_investment(
    platform="PS4",
    genre="Action",
    publisher="Ubisoft",
    year=2016
)

print("Investment Prediction:")
print(prediction)

recommendations = recommend_games(
    platform="PS4",
    genre="Action",
    publisher="Ubisoft",
    year=2016,
    top_n=5
)

print("\nRecommendations:")
for game in recommendations:
    print(game)