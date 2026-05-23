import streamlit as st
import pandas as pd
from model_service import predict_investment, recommend_games

# Sayfa yapısı
st.set_page_config(page_title="Game Investment AI", layout="wide")

st.title("🎮 Game Investment AI System")
st.markdown("---")

# Sol taraf: Input formu
col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("📊 Giriş Parametreleri")
    
    # Platform seçimi
    platforms = ["PS4", "PS3", "Xbox 360", "Nintendo DS", "PC", "Xbox One", "Wii", "DS"]
    platform = st.selectbox("Platform Seçin:", platforms)
    
    # Tür seçimi
    genres = ["Action", "Sports", "Shooter", "Adventure", "Racing", "Puzzle", "Fighting", "RPG"]
    genre = st.selectbox("Oyun Türü Seçin:", genres)
    
    # Yayıncı seçimi
    publishers = ["Ubisoft", "Electronic Arts", "Activision", "Take-Two Interactive", 
                 "Nintendo", "Sony Computer Entertainment", "Sega", "Microsoft Game Studios", "Other"]
    publisher = st.selectbox("Yayıncı Seçin:", publishers)
    
    # Yıl seçimi
    year = st.slider("Yıl Seçin:", min_value=2000, max_value=2025, value=2016)

with col2:
    st.subheader("📈 Tahmin Sonuçları")
    
    # Tahmin yap
    if st.button("🚀 Yatırım Tahminini Çalıştır", use_container_width=True):
        try:
            prediction = predict_investment(platform, genre, publisher, year)
            
            # Metrik gösterimi
            col2_1, col2_2, col2_3 = st.columns(3)
            
            with col2_1:
                st.metric(
                    "İyi Yatırım Olasılığı",
                    f"{prediction['good_investment_probability']:.2%}",
                    delta=f"Eşik: {prediction['threshold']:.2%}"
                )
            
            with col2_2:
                # Duruma göre emoji
                if prediction['recommendation_level'] == 'recommend_investment':
                    emoji = "✅"
                    color = "green"
                elif prediction['recommendation_level'] == 'needs_review':
                    emoji = "⚠️"
                    color = "orange"
                else:
                    emoji = "❌"
                    color = "red"
                
                st.metric("Tavsiye", emoji + " " + prediction['prediction'].replace('_', ' ').title())
            
            with col2_3:
                st.metric("Yayıncı Grubu", prediction['publisher_grouped'])
            
            # Detaylı bilgi
            st.markdown("---")
            st.markdown(f"""
            #### Analiz Detayları:
            - **Platform:** {prediction['platform']}
            - **Tür:** {prediction['genre']}
            - **Yayıncı:** {prediction['publisher']}
            - **Yıl:** {prediction['year']}
            - **İyi Yatırım Olasılığı:** {prediction['good_investment_probability']:.4f}
            - **Tavsiye Seviyesi:** {prediction['recommendation_level'].replace('_', ' ').title()}
            """)
            
            # Renk kodlu bilgi kutusu
            if prediction['recommendation_level'] == 'recommend_investment':
                st.success("✅ Bu proje yatırıma önerilmektedir!")
            elif prediction['recommendation_level'] == 'needs_review':
                st.warning("⚠️ Bu proje detaylı inceleme gerektirmektedir.")
            else:
                st.error("❌ Bu proje riskli olarak değerlendirilmektedir.")
            
        except Exception as e:
            st.error(f"Hata oluştu: {str(e)}")

# Oyun Önerileri Bölümü
st.markdown("---")
st.subheader("🎯 Benzer Oyun Önerileri")

if st.button("🔍 Benzer Oyunları Bul", use_container_width=True):
    try:
        recommendations = recommend_games(platform, genre, publisher, year, top_n=5)
        
        if len(recommendations) > 0:
            # Tablo olarak göster
            display_cols = ['name', 'platform', 'genre', 'publisher_grouped', 'global_sales', 'Similarity', 'Final_Score', 'Why_Recommended']
            available_cols = [col for col in display_cols if col in recommendations.columns]
            
            st.dataframe(
                recommendations[available_cols].rename(columns={
                    'name': 'Oyun Adı',
                    'platform': 'Platform',
                    'genre': 'Tür',
                    'publisher_grouped': 'Yayıncı',
                    'global_sales': 'Global Satışlar',
                    'Similarity': 'Benzerlik',
                    'Final_Score': 'Skor',
                    'Why_Recommended': 'Neden Önerildi'
                }),
                use_container_width=True,
                hide_index=True
            )
            
            # Detaylı görünüm
            st.markdown("#### Detaylı Öneriler:")
            for idx, game in recommendations.iterrows():
                with st.expander(f"🎮 {game['name']} (Skor: {game['Final_Score']:.2f})"):
                    col_game1, col_game2 = st.columns(2)
                    
                    with col_game1:
                        st.markdown(f"""
                        **Oyun Bilgileri:**
                        - Platform: {game['platform']}
                        - Tür: {game['genre']}
                        - Yayıncı: {game['publisher_grouped']}
                        - Yıl: {game['year']}
                        """)
                    
                    with col_game2:
                        st.markdown(f"""
                        **Performans Metrikleri:**
                        - Global Satışlar: {game['global_sales']:.2f}M
                        - Benzerlik: {game['Similarity']:.4f}
                        - Final Skor: {game['Final_Score']:.2f}
                        """)
                    
                    st.info(f"**Neden Önerildi:** {game['Why_Recommended']}")
        else:
            st.warning("Önerilen oyun bulunamadı.")
            
    except Exception as e:
        st.error(f"Hata oluştu: {str(e)}")

# Bilgi bölümü
st.markdown("---")
with st.expander("ℹ️ Sistem Hakkında"):
    st.markdown("""
    ### GameVestAI - Oyun Yatırım Sistemi
    
    Bu sistem, video oyun yatırımlarının karlılığını tahmin etmek için geliştirilmiş AI modellerini kullanır.
    
    **Kullanılan Modeller:**
    - **CatBoost Classifier**: Yatırım tahminleme
    - **KNN Model**: Benzer oyunları bulma
    
    **Veri Kaynağı:**
    - Kaggle Video Game Sales Dataset
    
    **Kontrol Edemeyeceğiniz Parametreler:**
    - Colab'da eğitilmiş model parametreleri
    - Eğitim verisi özellikleri
    """)
