import streamlit as st
import pandas as pd
import json
from pathlib import Path
from model_service import predict_investment, recommend_games
import plotly.graph_objects as go
import plotly.express as px

# Page configuration
st.set_page_config(
    page_title="GameVest AI - Oyun Yatırım Analizi",
    page_icon="🎮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply global CSS styling
def load_custom_css():
    st.markdown("""
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #0066cc;
            --success-color: #008f4c;
            --warning-color: #d97706;
            --danger-color: #dc2626;
            --light-bg: #f8fafc;
            --border-color: #e2e8f0;
        }
        
        h1, h2, h3 {
            color: #1f2937;
            font-weight: 600;
        }
        
        .stButton > button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .stButton > button:hover {
            background-color: #0052a3;
            box-shadow: 0 4px 12px rgba(0,102,204,0.3);
        }
        
        .gv-results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            width: 100%;
            margin: 20px 0;
        }
        
        .gv-result-card {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--primary-color);
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .gv-result-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            transform: translateY(-2px);
        }
        
        .gv-card-label {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .gv-card-value {
            font-size: clamp(20px, 2.5vw, 32px);
            font-weight: 600;
            line-height: 1.3;
            color: #1f2937;
            word-break: break-word;
            overflow-wrap: break-word;
        }
        
        .gv-card-delta {
            margin-top: 8px;
            font-size: 12px;
            color: var(--success-color);
            background-color: #dcefe5;
            width: fit-content;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 500;
        }
        
        .prediction-good {
            color: #008f4c;
        }
        
        .prediction-warning {
            color: #d97706;
        }
        
        .prediction-danger {
            color: #dc2626;
        }
    </style>
    """, unsafe_allow_html=True)

# Load CSS at the very beginning
load_custom_css()

# Load metadata
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

with open(MODEL_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# Sidebar title
st.sidebar.markdown("### <i class='fas fa-chart-bar'></i> GameVest AI", unsafe_allow_html=True)
st.sidebar.markdown("Oyun Yatırım Kararı Destek Sistemi")
st.sidebar.divider()

# Load data
df = pd.read_csv(BASE_DIR / "data" / "vgsales.csv")

# Main title
st.markdown("# <i class=\"fas fa-gamepad\"></i> Oyun Yatırım Analizi Platformu", unsafe_allow_html=True)
st.markdown("Platforma, türe, yıla ve yayıncıya göre yatırım potansiyelini analiz edin")
st.divider()

# ==================== ARAMA MOTORU (ANA SAYFA ÜSTÜ) ====================
st.markdown("## <i class=\"fas fa-search\"></i> Oyun Ara", unsafe_allow_html=True)
search_term = st.text_input("Oyun adını girin:", placeholder="Örneğin: Mario, FIFA, GTA...", key="main_search")

if search_term:
    # Filter games
    search_results = df[
        df['Name'].str.contains(search_term, case=False, na=False)
    ].copy()

    if len(search_results) > 0:
        st.success(f"{len(search_results)} oyun bulundu")
        
        selected_game = st.selectbox(
            "Oyun seçin:",
            options=search_results['Name'].tolist(),
            label_visibility="collapsed",
            key="game_select"
        )

        # Get selected game details
        game_data = df[df['Name'] == selected_game].iloc[0]

        st.divider()

        # Display game details
        st.markdown(f"## <i class='fas fa-chart-pie'></i> {game_data['Name']} Detayları", unsafe_allow_html=True)

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(label="Platform", value=game_data['Platform'])
            st.metric(label="Tür", value=game_data['Genre'])
        
        with col2:
            st.metric(label="Yıl", value=int(game_data['Year']) if pd.notna(game_data['Year']) else "N/A")
            st.metric(label="Yayıncı", value=game_data['Publisher'])
        
        with col3:
            st.metric(label="Global Satışlar", value=f"{game_data['Global_Sales']:.2f}M")
            st.metric(label="Toplam Bölge Satışı", value=f"{game_data['NA_Sales'] + game_data['EU_Sales'] + game_data['JP_Sales'] + game_data['Other_Sales']:.2f}M")

        st.divider()

        # Graphics and Analysis
        st.markdown("## <i class='fas fa-chart-line'></i> Grafiksel Analizler", unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        # Regional Sales Chart
        with col1:
            regions_data = {
                'Bölge': ['Kuzey Amerika', 'Avrupa', 'Japonya', 'Diğer'],
                'Satışlar': [
                    game_data['NA_Sales'],
                    game_data['EU_Sales'],
                    game_data['JP_Sales'],
                    game_data['Other_Sales']
                ]
            }
            regions_df = pd.DataFrame(regions_data)

            fig_pie = px.pie(
                regions_df,
                values='Satışlar',
                names='Bölge',
                title="Bölgesel Satış Dağılımı",
                color_discrete_sequence=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
            )
            fig_pie.update_traces(textposition='inside', textinfo='percent+label')
            st.plotly_chart(fig_pie, use_container_width=True)

        # Sales by genre
        with col2:
            fig_box = go.Figure()
            all_genre_games = df[df['Genre'] == game_data['Genre']]['Global_Sales'].values
            
            fig_box.add_trace(go.Box(
                y=all_genre_games,
                name=f"{game_data['Genre']} Türü",
                boxmean='sd',
                marker_color='#45B7D1'
            ))
            
            fig_box.add_hline(
                y=game_data['Global_Sales'],
                line_dash="dash",
                line_color="red",
                annotation_text=f"{game_data['Name']} ({game_data['Global_Sales']:.2f}M)",
                annotation_position="right"
            )
            
            fig_box.update_layout(
                title=f"{game_data['Genre']} Türündeki Satış Dağılımı",
                yaxis_title="Global Satışlar (Milyon)",
                showlegend=False,
                height=400
            )
            
            st.plotly_chart(fig_box, use_container_width=True)

        st.divider()

        # Platform and Publisher Comparison
        col1, col2 = st.columns(2)

        with col1:
            st.markdown(f"## <i class='fas fa-desktop'></i> {game_data['Platform']} Platformu İstatistikleri", unsafe_allow_html=True)
            
            platform_games = df[df['Platform'] == game_data['Platform']]
            
            fig_platform = go.Figure()
            
            fig_platform.add_trace(go.Bar(
                x=['Ortalama', 'Medyan', 'Maksimum'],
                y=[
                    platform_games['Global_Sales'].mean(),
                    platform_games['Global_Sales'].median(),
                    platform_games['Global_Sales'].max()
                ],
                marker_color=['#45B7D1', '#96CEB4', '#FFEAA7'],
                text=[
                    f"{platform_games['Global_Sales'].mean():.2f}M",
                    f"{platform_games['Global_Sales'].median():.2f}M",
                    f"{platform_games['Global_Sales'].max():.2f}M"
                ],
                textposition='auto'
            ))
            
            fig_platform.add_hline(
                y=game_data['Global_Sales'],
                line_dash="dash",
                line_color="red",
                annotation_text=f"Bu oyun: {game_data['Global_Sales']:.2f}M"
            )
            
            fig_platform.update_layout(
                title=f"{game_data['Platform']} Platformundaki Satış Karşılaştırması",
                yaxis_title="Global Satışlar (Milyon)",
                showlegend=False,
                height=400
            )
            
            st.plotly_chart(fig_platform, use_container_width=True)

        with col2:
            st.markdown(f"## <i class='fas fa-building'></i> {game_data['Publisher']} Yayıncı İstatistikleri", unsafe_allow_html=True)
            
            publisher_games = df[df['Publisher'] == game_data['Publisher']]
            
            fig_publisher = go.Figure()
            
            fig_publisher.add_trace(go.Bar(
                x=['Ortalama', 'Medyan', 'Maksimum'],
                y=[
                    publisher_games['Global_Sales'].mean(),
                    publisher_games['Global_Sales'].median(),
                    publisher_games['Global_Sales'].max()
                ],
                marker_color=['#FF6B6B', '#C44569', '#F8B500'],
                text=[
                    f"{publisher_games['Global_Sales'].mean():.2f}M",
                    f"{publisher_games['Global_Sales'].median():.2f}M",
                    f"{publisher_games['Global_Sales'].max():.2f}M"
                ],
                textposition='auto'
            ))
            
            fig_publisher.add_hline(
                y=game_data['Global_Sales'],
                line_dash="dash",
                line_color="blue",
                annotation_text=f"Bu oyun: {game_data['Global_Sales']:.2f}M"
            )
            
            fig_publisher.update_layout(
                title=f"{game_data['Publisher']} Yayıncısının Satış Karşılaştırması",
                yaxis_title="Global Satışlar (Milyon)",
                showlegend=False,
                height=400
            )
            
            st.plotly_chart(fig_publisher, use_container_width=True)

        st.divider()

        # Time series - same genre over years
        st.markdown(f"## <i class='fas fa-calendar-alt'></i> {game_data['Genre']} Türünün Zaman İçinde Satışları", unsafe_allow_html=True)
        
        genre_timeline = df[df['Genre'] == game_data['Genre']].groupby('Year')['Global_Sales'].sum().reset_index()
        
        fig_timeline = px.line(
            genre_timeline,
            x='Year',
            y='Global_Sales',
            title=f"{game_data['Genre']} Türünün Yıllık Satış Trendi",
            markers=True,
            line_shape='spline'
        )
        
        fig_timeline.add_hline(
            y=game_data['Global_Sales'],
            line_dash="dash",
            line_color="red",
            annotation_text=f"Bu oyun: {game_data['Global_Sales']:.2f}M"
        )
        
        fig_timeline.update_layout(
            xaxis_title="Yıl",
            yaxis_title="Global Satışlar (Milyon)",
            height=400
        )
        
        st.plotly_chart(fig_timeline, use_container_width=True)

        st.divider()

        # Game table info
        st.markdown("## <i class='fas fa-list'></i> Detaylı Bilgiler", unsafe_allow_html=True)
        
        info_table = pd.DataFrame({
            'Özellik': ['Adı', 'Platform', 'Tür', 'Yıl', 'Yayıncı', 
                       'K. Amerika', 'Avrupa', 'Japonya', 'Diğer', 'Global'],
            'Satışlar (Milyon)': [
                game_data['Name'],
                game_data['Platform'],
                game_data['Genre'],
                int(game_data['Year']) if pd.notna(game_data['Year']) else "N/A",
                game_data['Publisher'],
                f"{game_data['NA_Sales']:.2f}",
                f"{game_data['EU_Sales']:.2f}",
                f"{game_data['JP_Sales']:.2f}",
                f"{game_data['Other_Sales']:.2f}",
                f"{game_data['Global_Sales']:.2f}"
            ]
        })
        
        st.table(info_table)

    else:
        st.warning(f"'{search_term}' adında oyun bulunamadı.")
        st.info("Başka bir isim deneyin.")

st.divider()

# ==================== YÖNETİM SEÇENEKLERI ====================
st.markdown("## <i class='fas fa-chart-bar'></i> Yatırım Analizi", unsafe_allow_html=True)

# Navigation
analysis_page = st.radio(
    "Seçin:",
    ["Tahmin Yap", "Benzer Oyun Öner"],
    horizontal=True,
    label_visibility="collapsed"
)

# ==================== TAHMIN SAYFASI ====================
if analysis_page == "Tahmin Yap":
    st.markdown("## <i class='fas fa-list'></i> Oyun Bilgilerini Girin", unsafe_allow_html=True)

    # Get unique values
    platforms = sorted(df['Platform'].unique().tolist())
    genres = sorted(df['Genre'].unique().tolist())
    years = sorted(df['Year'].dropna().unique().astype(int).tolist(), reverse=True)
    publishers = metadata["top_publishers"] + ["Other"]

    col1, col2 = st.columns(2)

    with col1:
        platform = st.selectbox(
            "Platform:",
            options=platforms,
            index=0,
            key="pred_platform"
        )

    with col2:
        genre = st.selectbox(
            "Tür:",
            options=genres,
            index=0,
            key="pred_genre"
        )

    col3, col4 = st.columns(2)

    with col3:
        year = st.slider(
            "Yıl:",
            min_value=min(years),
            max_value=max(years),
            value=max(years),
            key="pred_year"
        )

    with col4:
        publisher = st.selectbox(
            "Yayıncı:",
            options=publishers,
            index=0,
            key="pred_publisher"
        )

    col_btn1, col_btn2 = st.columns(2)

    with col_btn1:
        if st.button("Analiz Et", use_container_width=True, type="primary", key="analyze_btn"):
            try:
                result = predict_investment(platform, genre, publisher, year)
                
                st.markdown("## <i class='fas fa-chart-line'></i> Analiz Sonuçları", unsafe_allow_html=True)
                
                prediction_icon = {
                    "good_investment": "<i class='fas fa-check-circle prediction-good'></i>",
                    "needs_review": "<i class='fas fa-exclamation-circle prediction-warning'></i>",
                    "risky_investment": "<i class='fas fa-times-circle prediction-danger'></i>"
                }
                prediction_text = {
                    "good_investment": "İyi Yatırım",
                    "needs_review": "İnceleme Gerekli",
                    "risky_investment": "Riskli Yatırım"
                }
                
                prediction_value = f"{prediction_icon[result['prediction']]} {prediction_text[result['prediction']]}"
                
                st.markdown(f"""
<div class="gv-results-grid">
    <div class="gv-result-card">
        <div class="gv-card-label">Başarı Olasılığı</div>
        <div class="gv-card-value">{result['good_investment_probability']:.2%}</div>
        <div class="gv-card-delta">Eşik: {result['threshold']:.2%}</div>
    </div>
    <div class="gv-result-card">
        <div class="gv-card-label">Tahmin</div>
        <div class="gv-card-value">{prediction_value}</div>
    </div>
    <div class="gv-result-card">
        <div class="gv-card-label">Platform</div>
        <div class="gv-card-value">{platform}</div>
    </div>
    <div class="gv-result-card">
        <div class="gv-card-label">Tür / Yıl</div>
        <div class="gv-card-value">{genre} / {year}</div>
    </div>
</div>
""", unsafe_allow_html=True)
                
                st.divider()
                
                st.markdown("## <i class='fas fa-chart-pie'></i> Detaylı Bilgiler", unsafe_allow_html=True)
                
                results_data = {
                    "Platform": result['platform'],
                    "Tür": result['genre'],
                    "Yıl": result['year'],
                    "Yayıncı": result['publisher'],
                    "Normalize Yayıncı": result['publisher_grouped'],
                    "Başarı Olasılığı": f"{result['good_investment_probability']:.4f}",
                    "Başarı Eşiği": f"{result['threshold']:.4f}",
                    "Tahmin": result['prediction'],
                    "Önerilen Işlem": result['recommendation_level']
                }
                
                results_df = pd.DataFrame([results_data]).T
                results_df.columns = ["Değer"]
                st.table(results_df)
                
                st.markdown("## <i class='fas fa-comment-dots'></i> Yorumlama", unsafe_allow_html=True)
                
                if result['prediction'] == "good_investment":
                    st.success(f"<i class='fas fa-check-circle'></i> Bu oyun **iyi bir yatırım** görünüyor!")
                elif result['prediction'] == "needs_review":
                    st.warning(f"<i class='fas fa-exclamation-triangle'></i> Bu oyun **inceleme gerektirir**.")
                else:
                    st.error(f"<i class='fas fa-times-circle'></i> Bu oyun **riskli bir yatırım** olarak değerlendirilmektedir.")
                
            except Exception as e:
                st.error(f"Hata oluştu: {str(e)}")

# ==================== BENZERoyunlar SAYFASI ====================
else:  # "<i class='fas fa-lightbulb'></i> Benzer Oyun Öner"
    st.markdown("## <i class='fas fa-list'></i> Oyun Bilgilerini Girin", unsafe_allow_html=True)

    # Get unique values
    platforms = sorted(df['Platform'].unique().tolist())
    genres = sorted(df['Genre'].unique().tolist())
    years = sorted(df['Year'].dropna().unique().astype(int).tolist(), reverse=True)
    publishers = metadata["top_publishers"] + ["Other"]

    col1, col2 = st.columns(2)

    with col1:
        platform = st.selectbox(
            "Platform:",
            options=platforms,
            index=0,
            key="rec_platform"
        )

    with col2:
        genre = st.selectbox(
            "Tür:",
            options=genres,
            index=0,
            key="rec_genre"
        )

    col3, col4 = st.columns(2)

    with col3:
        year = st.slider(
            "Yıl:",
            min_value=min(years),
            max_value=max(years),
            value=max(years),
            key="rec_year"
        )

    with col4:
        publisher = st.selectbox(
            "Yayıncı:",
            options=publishers,
            index=0,
            key="rec_publisher"
        )

    if st.button("Benzer Oyunları Öner", use_container_width=True, type="primary", key="recommend_btn"):
        try:
            recommendations = recommend_games(platform, genre, publisher, year, top_n=10)
            
            st.markdown("## <i class='fas fa-bullseye'></i> Benzer Oyun Önerileri (Top 10)", unsafe_allow_html=True)
            
            if recommendations is not None and len(recommendations) > 0:
                st.dataframe(
                    recommendations,
                    use_container_width=True,
                    height=400
                )
                
                csv = recommendations.to_csv(index=False)
                st.download_button(
                    label="Önerileri İndir (CSV)",
                    data=csv,
                    file_name=f"recommendations_{platform}_{genre}_{year}.csv",
                    mime="text/csv"
                )
            else:
                st.info("Benzer oyun bulunamadı.")
                
        except Exception as e:
            st.error(f"Hata oluştu: {str(e)}")

# Footer
st.divider()
st.markdown("""
    <div style='text-align: center; color: gray; font-size: 0.8rem;'>
    GameVest AI v1.0 | <i class="fas fa-robot"></i> Makine Öğrenmesi Destekli Yatırım Analiz Sistemi
    </div>
    """, unsafe_allow_html=True)
