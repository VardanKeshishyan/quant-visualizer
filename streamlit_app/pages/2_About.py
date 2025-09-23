import streamlit as st

st.set_page_config(page_title="About Quant Visualizer Pro", layout="wide")

# Custom CSS
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        background-attachment: fixed;
        color: #f8fafc;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .about-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 60px 20px 40px 20px;
        max-width: 1100px;
        margin: 0 auto;
    }

    h1 {
        font-size: 3.2em;
        margin-bottom: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        letter-spacing: -0.02em;
    }

    p, li {
        font-size: 1.15em;
        line-height: 1.7;
        color: #e2e8f0;
        font-weight: 400;
    }

    ul {
        text-align: left;
        margin: 25px auto;
        max-width: 850px;
        font-size: 1.1em;
        color: #cbd5e1;
        padding-left: 0;
    }

    ul li {
        margin-bottom: 16px;
        padding: 12px 20px;
        background: rgba(15, 23, 42, 0.6);
        border-left: 4px solid #22c55e;
        border-radius: 8px;
        list-style: none;
        transition: all 0.3s ease;
    }

    ul li:hover {
        background: rgba(15, 23, 42, 0.8);
        transform: translateX(8px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
    }

    ul li strong {
        color: #22c55e;
        font-weight: 600;
    }

    .columns {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 50px;
        flex-wrap: wrap;
        max-width: 900px;
    }

    .card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 16px;
        padding: 30px;
        min-width: 300px;
        flex: 1;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }

    .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        transform: scaleX(0);
        transition: transform 0.4s ease;
    }

    .card:hover::before {
        transform: scaleX(1);
    }

    .card:hover {
        transform: translateY(-8px);
        border-color: rgba(34, 197, 94, 0.6);
        box-shadow: 0 12px 40px rgba(34, 197, 94, 0.2);
    }

    .card h3 {
        margin-bottom: 16px;
        font-size: 1.4em;
        font-weight: 600;
        color: #22c55e;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .card p {
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 1.05em;
    }

    .tech-stack {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(34, 197, 94, 0.4);
        border-radius: 16px;
        padding: 30px;
        margin: 30px auto;
        max-width: 850px;
        text-align: center;
    }

    .tech-stack h3 {
        color: #22c55e;
        margin-bottom: 20px;
        font-size: 1.3em;
    }

    .tech-badge {
        display: inline-block;
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1));
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 20px;
        padding: 8px 16px;
        margin: 6px;
        font-weight: 600;
        color: #22c55e;
        font-size: 0.95em;
        transition: all 0.3s ease;
    }

    .tech-badge:hover {
        background: rgba(34, 197, 94, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .disclaimer {
        background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 30px auto;
        max-width: 800px;
        text-align: center;
        color: #fbbf24;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .columns {
            flex-direction: column;
            align-items: center;
        }

        h1 {
            font-size: 2.5em;
        }

        .card {
            min-width: 280px;
        }
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Page content
st.markdown('<div class="about-container">', unsafe_allow_html=True)

st.markdown('<h1>📊 About Quant Visualizer Pro</h1>', unsafe_allow_html=True)

st.markdown(
    """
    <p style="text-align: center; font-size: 1.25em; max-width: 800px; margin: 0 auto 40px auto;">
    Professional-grade quantitative finance platform designed for advanced statistical analysis 
    of financial markets. Built with institutional-quality mathematical models and real-time market data integration.
    </p>

    <ul>
        <li><strong>📈 Advanced Price Analysis</strong>: Multi-timeframe price movement tracking with sophisticated trend identification algorithms</li>
        <li><strong>📊 Statistical Z-Score Analysis</strong>: Real-time deviation detection in return differentials with configurable threshold alerts (|z| > 2σ)</li>
        <li><strong>🎯 3D Distribution Modeling</strong>: Joint probability analysis using Gaussian ellipsoids with dynamic correlation strength visualization</li>
        <li><strong>⚡ Dynamic Rolling Correlation</strong>: Multi-window correlation computation (30, 60, 90-day periods) with temporal analysis</li>
        <li><strong>🔬 Professional Backtesting</strong>: Comprehensive strategy simulation with risk-adjusted performance metrics and drawdown analysis</li>
        <li><strong>📋 Automated Reporting</strong>: Excel export functionality with professional formatting and detailed performance analytics</li>
    </ul>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="tech-stack">
        <h3>🛠️ Technology Stack</h3>
        <div>
            <span class="tech-badge">Python 3.9+</span>
            <span class="tech-badge">Streamlit</span>
            <span class="tech-badge">yFinance</span>
            <span class="tech-badge">Plotly</span>
            <span class="tech-badge">NumPy</span>
            <span class="tech-badge">SciPy</span>
            <span class="tech-badge">Pandas</span>
            <span class="tech-badge">OpenPyXL</span>
        </div>
        <p style="margin-top: 20px; color: #cbd5e1; font-size: 1.05em;">
            Built with enterprise-grade libraries for maximum reliability and performance
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

st.markdown('<div class="columns">', unsafe_allow_html=True)
st.markdown(
    """
    <div class="card">
        <h3>💡 Inspiration</h3>
        <p>Developed using advanced statistical finance principles from academic research and institutional trading methodologies. 
        Incorporates proven quantitative strategies used by hedge funds and proprietary trading firms.</p>
    </div>
    <div class="card">
        <h3>⚠️ Important Limitations</h3>
        <p>Results are theoretical simulations that exclude real-world factors including transaction costs, 
        bid-ask spreads, liquidity constraints, and market impact. This platform is designed for educational 
        and research purposes only.</p>
    </div>
    """,
    unsafe_allow_html=True
)
st.markdown('</div>', unsafe_allow_html=True)

st.markdown(
    """
    <div class="disclaimer">
        <strong>⚖️ Professional Disclaimer</strong><br>
        This software is an educational tool for quantitative finance research and should not be construed as financial advice. 
        All trading strategies involve substantial risk of loss. Past performance does not guarantee future results.
        Consult with qualified financial professionals before making investment decisions.
    </div>
    """,
    unsafe_allow_html=True
)

st.markdown('</div>', unsafe_allow_html=True)
