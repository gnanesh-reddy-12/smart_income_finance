import streamlit as st

# Page configuration
st.set_page_config(page_title="Smart Finance Dashboard", layout="centered")

st.markdown("## 💼 Smart Finance Dashboard")
st.markdown("Welcome! Analyze your monthly spending and check your financial health 🔍")

# --- Input Section in Columns ---
st.markdown("### 📥 Enter Your Monthly Income & Expenses")

col1, col2 = st.columns(2)
with col1:
    income = st.number_input("Monthly Income (₹)", min_value=0, step=100)
    rent = st.number_input("🏠 Rent (₹)", min_value=0, step=100)
    food = st.number_input("🍽 Food (₹)", min_value=0, step=100)
    transport = st.number_input("🚌 Transport (₹)", min_value=0, step=100)
with col2:
    subscriptions = st.number_input("📺 Subscriptions (₹)", min_value=0, step=100)
    shopping = st.number_input("🛍 Shopping (₹)", min_value=0, step=100)
    others = st.number_input("🔧 Others (₹)", min_value=0, step=100)

# --- Calculate on Button ---
if st.button("💡 Analyze My Finances"):
    total_expense = rent + food + transport + subscriptions + shopping + others
    savings = income - total_expense
    percent = lambda amt: (amt / income * 100) if income else 0

    # --- Summary Output ---
    st.markdown("---")
    st.subheader("📊 Financial Summary")
    st.write(f"**Total Income:** ₹{income}")
    st.write(f"**Total Expenses:** ₹{total_expense}")
    st.write(f"**Savings:** ₹{savings}")

    st.markdown("### 📈 Expense Breakdown")
    st.write(f"🏠 Rent: ₹{rent} ({percent(rent):.2f}%)")
    st.write(f"🍽 Food: ₹{food} ({percent(food):.2f}%)")
    st.write(f"🚌 Transport: ₹{transport} ({percent(transport):.2f}%)")
    st.write(f"📺 Subscriptions: ₹{subscriptions} ({percent(subscriptions):.2f}%)")
    st.write(f"🛍 Shopping: ₹{shopping} ({percent(shopping):.2f}%)")
    st.write(f"🔧 Others: ₹{others} ({percent(others):.2f}%)")

    st.markdown("### 🧮 Financial Health Score")
    if savings >= income * 0.2:
        st.success("🟢 Great! You're saving well. (Score: 100/100)")
    elif savings >= 0:
        st.info("🟡 You're okay, but could save more. (Score: 60/100)")
    else:
        st.error("🔴 You're overspending. (Score: 0/100)")
