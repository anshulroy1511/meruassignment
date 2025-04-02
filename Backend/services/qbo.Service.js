// services/qbo.service.js
const axios = require("axios");
const { QB_API_BASE_URL } = require("../config/qbo.config");

class QBOService {
  static async fetchAccounts(accessToken, realmId) {
    try {
      const response = await axios.get(
        `${QB_API_BASE_URL}/${realmId}/query?query=SELECT * FROM Account MAXRESULTS 1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return response.data.QueryResponse.Account || [];
    } catch (error) {
      console.error(
        "QBO API Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  static async fetchVendors(accessToken, realmId) {
    try {
      const response = await axios.get(
        `${QB_API_BASE_URL}/${realmId}/query?query=SELECT * FROM Vendor MAXRESULTS 1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return response.data.QueryResponse.Vendor || [];
    } catch (error) {
      console.error(
        "QBO API Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  static async fetchCustomers(accessToken, realmId) {
    try {
      const response = await axios.get(
        `${QB_API_BASE_URL}/${realmId}/query?query=SELECT * FROM Customer MAXRESULTS 1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return response.data.QueryResponse.Customer || [];
    } catch (error) {
      console.error(
        "QBO API Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  static async fetchUncategorizedPurchases(accessToken, realmId) {
    try {
      // First get all purchases
      const response = await axios.get(
        `${QB_API_BASE_URL}/${realmId}/query?query=SELECT * FROM Purchase MAXRESULTS 1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const allPurchases = response.data.QueryResponse.Purchase || [];

      // Filter for uncategorized purchases client-side
      return allPurchases.filter((purchase) => {
        return !purchase.AccountRef || !purchase.AccountRef.value;
      });
    } catch (error) {
      console.error(
        "QBO API Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  static async fetchUncategorizedDeposits(accessToken, realmId) {
    try {
      // First get all deposits
      const response = await axios.get(
        `${QB_API_BASE_URL}/${realmId}/query?query=SELECT * FROM Deposit MAXRESULTS 1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const allDeposits = response.data.QueryResponse.Deposit || [];

      // Filter for uncategorized deposits client-side
      return allDeposits.filter((deposit) => {
        return !deposit.AccountRef || !deposit.AccountRef.value;
      });
    } catch (error) {
      console.error(
        "QBO API Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}

module.exports = QBOService;
