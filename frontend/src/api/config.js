/**
 * API Configuration
 * 
 * Flask backend'iniz bu ayarlarla eşleşmeli:
 * - URL: http://localhost:5000
 * - CORS enabled olmalı
 * - /api/predict endpoint'i POST isteğini kabul etmeli
 */

// Backend API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Expected request format for /api/predict
 * POST http://localhost:5000/api/predict
 * 
 * Body:
 * {
 *   game_title: string (required) - Oyun adı
 *   primary_genre: string (required) - Birincil tür (rpg, fps, strategy, etc.)
 *   secondary_genre: string|null - İkincil tür (opsiyonel)
 *   platforms: string (required) - Platformlar (pc, console, cross, mobile, vr)
 *   release_year: number (required) - Yayın yılı (YYYY formatında)
 * }
 * 
 * Expected response format:
 * {
 *   "invest": boolean,                    // Yatırım yapılmalı mı?
 *   "confidence": number (0-100),          // Güven skoru
 *   "opportunity_score": number (0-100),   // Fırsat skoru
 *   "recommendation": string,              // "INVEST" veya "SKIP"
 *   
 *   // Opsiyonel: Satış metrikleri
 *   "sales_momentum": string,              // "$124.5M"
 *   "sales_trend": string,                 // "+14.2%"
 *   
 *   // Opsiyonel: Retention metrikleri
 *   "retention_day1": number,              // 0-100
 *   "retention_day7": number,              // 0-100
 *   "retention_day30": number,             // 0-100
 *   
 *   // Opsiyonel: ARPU metrikleri
 *   "arpu": string,                        // "$42.80"
 *   "arpu_trend": string,                  // "+2.1%"
 *   
 *   // Opsiyonel: Bölgesel metrikleri
 *   "americas_pct": number,
 *   "americas_value": string,
 *   "europe_pct": number,
 *   "europe_value": string,
 *   "asia_pct": number,
 *   "asia_value": string,
 *   
 *   // Opsiyonel: Benzer oyunlar
 *   "similar_games": [
 *     {
 *       "title": string,
 *       "match": string,           // "92.4%"
 *       "platform": string,
 *       "genre": string,
 *       "publisher": string,
 *       "sales": string,
 *       "critic": string,
 *       "user": string
 *     }
 *   ]
 * }
 */

/**
 * Flask Backend örneği (@app.route('/api/predict', methods=['POST']))
 * 
 * @app.route('/api/predict', methods=['POST'])
 * def predict():
 *     data = request.json
 *     # Model prediction logic
 *     result = model.predict(
 *         game_title=data['game_title'],
 *         primary_genre=data['primary_genre'],
 *         platforms=data['platforms'],
 *         release_year=data['release_year']
 *     )
 *     
 *     return jsonify({
 *         'invest': result['should_invest'],
 *         'confidence': result['confidence_score'],
 *         'opportunity_score': result['opportunity_score'],
 *         'recommendation': 'INVEST' if result['should_invest'] else 'SKIP',
 *         'sales_momentum': f"${result['predicted_sales']:.1f}M",
 *         'sales_trend': f"+{result['sales_growth']:.1f}%",
 *         'retention_day1': result['retention_day1'],
 *         'retention_day7': result['retention_day7'],
 *         'retention_day30': result['retention_day30'],
 *     })
 */
