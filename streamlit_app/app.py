import streamlit as st

st.set_page_config(
    page_title="Quant Visualizer", 
    page_icon="📈", # keeping only the page icon for browser tab
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown(
    """
    <style>
    /* Import modern fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global app styling with clean professional design */
    .stApp {
        background: #ffffff;
        color: #1f2937;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Clean sidebar styling */
    .css-1d391kg, .css-1lcbmhc {
        background: #f9fafb;
        border-right: 1px solid #e5e7eb;
    }
    
    /* Navigation improvements - clean style */
    .css-1v0mbdj {
        background: transparent;
        border-radius: 8px;
        padding: 8px 16px;
        margin: 4px 0;
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }
    
    .css-1v0mbdj:hover {
        background: #f3f4f6;
        border-color: #22c55e;
    }
    
    /* Professional typography */
    h1, h2, h3, h4, h5, h6 {
        color: #1f2937;
        font-weight: 600;
        letter-spacing: -0.025em;
    }
    
    /* Clean button styling */
    .stButton > button {
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 12px 24px;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: #16a34a;
        transform: translateY(-1px);
    }
    
    /* Clean header styling */
    .nav-header {
        background: white;
        padding: 40px 20px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 40px;
    }
    
    /* Feature cards */
    .feature-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        margin: 16px 0;
        transition: all 0.3s ease;
    }
    
    .feature-card:hover {
        border-color: #22c55e;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
    }
    
    /* Clean input styling */
    .stSelectbox > div > div {
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 8px;
    }
    
    .stDateInput > div > div {
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 8px;
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="nav-header">
        <h1 style="margin: 0; font-size: 2.5em; color: #1f2937;">
            Quant Visualizer
        </h1>
        <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 1.2em;">
            Advanced Quantitative Analysis for Stock Pairs
        </p>
        <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 1em;">
            Discover complex mathematical relationships in financial markets through interactive visualizations, statistical analysis, and backtesting designed for modern traders.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

pages = st.navigation([
    st.Page("pages/1_Home.py", title="Home"),
    st.Page("pages/2_About.py", title="About"),
    st.Page("pages/Experiment.py", title="Analytics")
])

pages.run()
