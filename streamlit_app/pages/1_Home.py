import streamlit as st
from pathlib import Path

st.set_page_config(page_title="Quant Visualizer - Home", layout="wide")

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .stApp {
        background: #ffffff;
        color: #1f2937;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .hero-section {
        text-align: center;
        padding: 60px 20px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        margin-bottom: 60px;
    }

    .hero-title {
        font-size: 3.5em;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 20px;
        letter-spacing: -0.02em;
    }

    .hero-subtitle {
        font-size: 1.3em;
        color: #22c55e;
        font-weight: 600;
        margin-bottom: 15px;
    }

    .hero-description {
        font-size: 1.1em;
        color: #6b7280;
        max-width: 800px;
        margin: 0 auto 40px auto;
        line-height: 1.6;
    }

    .cta-button {
        background: #22c55e;
        color: white;
        padding: 16px 32px;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }

    .cta-button:hover {
        background: #16a34a;
        transform: translateY(-2px);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 60px auto;
        padding: 0 20px;
    }

    .feature-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
    }

    .feature-card:hover {
        border-color: #22c55e;
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.1);
        transform: translateY(-4px);
    }

    .feature-icon {
        font-size: 3em;
        margin-bottom: 20px;
        color: #22c55e;
    }

    .feature-title {
        font-size: 1.3em;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 15px;
    }

    .feature-description {
        color: #6b7280;
        line-height: 1.6;
    }

    .example-section {
        background: #f9fafb;
        padding: 60px 20px;
        margin: 60px 0;
    }

    .example-container {
        max-width: 1000px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        padding: 40px;
        border: 1px solid #e5e7eb;
    }

    .example-title {
        font-size: 1.5em;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 20px;
        text-align: center;
    }

    .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }

    .example-item {
        text-align: center;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
    }

    .example-item h4 {
        color: #22c55e;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .example-item p {
        color: #6b7280;
        font-size: 0.9em;
        line-height: 1.5;
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="hero-section">
        <h1 class="hero-title">Advanced Quantitative Analysis for Stock Pairs</h1>
        <p class="hero-subtitle">Discover complex mathematical relationships in financial markets through interactive visualizations</p>
        <p class="hero-description">
            Statistical analysis, and backtesting designed for modern traders.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

col1, col2, col3 = st.columns([1, 1, 1])
with col2:
    if st.button("Start Analysis", key="get_started", use_container_width=True):
        st.switch_page("pages/Experiment.py")

st.markdown(
    """
    <div style="text-align: center; margin: 60px 0 40px 0;">
        <h2 style="color: #1f2937; font-size: 2.2em; font-weight: 600;">Powerful Analytics Features</h2>
        <p style="color: #6b7280; font-size: 1.1em;">Comprehensive tools for quantitative finance analysis, from basic pair tracking to advanced statistical modeling.</p>
    </div>

    <div class="features-grid">
        <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">2D Price Analysis</h3>
            <p class="feature-description">
                Track pair trajectories and identify trading opportunities with advanced price movement analysis and statistical anomaly detection.
            </p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3 class="feature-title">Z-Score Detection</h3>
            <p class="feature-description">
                Detect statistical differences in price movements and identify when pairs deviate from their historical relationship patterns.
            </p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3 class="feature-title">3D Distribution</h3>
            <p class="feature-description">
                Visualize joint probability distributions and understand the statistical relationship between paired securities through interactive 3D analysis.
            </p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">📉</div>
            <h3 class="feature-title">Rolling Correlation</h3>
            <p class="feature-description">
                Compare rolling correlations over multiple time windows (30, 60, 90 days) to identify changing market relationships and statistical convergence.
            </p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Backtesting Engine</h3>
            <p class="feature-description">
                Simulate trading strategies with historical data to evaluate performance and risk-adjusted returns using advanced quantitative methodologies.
            </p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Real-time Analytics</h3>
            <p class="feature-description">
                Get instant analysis and statistical computations with live market data integration and professional-grade financial calculations.
            </p>
        </div>
    </div>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="example-section">
        <div class="example-container">
            <h3 class="example-title">Understanding Pairs Trading</h3>
            <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">
                A practical overview of how quantitative analysis drives trading decisions
            </p>

            <div class="example-grid">
                <div class="example-item">
                    <h4>Long Opportunity</h4>
                    <p>
                        This company is about to experience a significant relative outperformance vs its paired security, creating a long opportunity.
                    </p>
                </div>

                <div class="example-item">
                    <h4>Short Opportunity</h4>
                    <p>
                        Short companies trading at expensive valuations relative to their paired security, capturing mean reversion opportunities.
                    </p>
                </div>

                <div class="example-item">
                    <h4>Profit from Performance</h4>
                    <p>
                        Profit from relative performance differences rather than absolute market direction, regardless of overall market conditions.
                    </p>
                </div>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #22c55e;">
                <h4 style="color: #22c55e; margin-bottom: 10px;">Example Scenario</h4>
                <p style="color: #6b7280; margin: 0;">
                    Suppose Company A and Company B are in the same sector and historically move together. 
                    When Company A starts to outperform Company B by 3% over their normal spread, 
                    you could go long Company A and short Company B to profit from this statistical divergence, 
                    expecting the spread to normalize over time. The strategy profits whether the sector goes up or down.
                </p>
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True
)
