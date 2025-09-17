// CRM GraphQL Queries

export const GET_DASHBOARD_DATA = `
  query GetDashboardData {
    dashboardData {
      totalCustomers
      activeCustomers
      totalLeads
      qualifiedLeads
      totalCampaigns
      activeCampaigns
      totalRevenue
      monthlyRevenue
      conversionRate
      averageLeadScore
    }
  }
`;

export const GET_CUSTOMERS = `
  query GetCustomers($filter: CustomerFilter, $limit: Int, $offset: Int) {
    customers(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      email
      phone
      company
      value
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_DETAILS = `
  query GetCustomerDetails($id: ID!) {
    customer(id: $id) {
      id
      name
      email
      phone
      company
      value
      status
      createdAt
      updatedAt
      leads {
        id
        name
        stage
        score
        expectedValue
      }
      campaigns {
        id
        name
        type
        status
        roi
      }
    }
  }
`;

export const GET_LEADS = `
  query GetLeads($filter: LeadFilter, $limit: Int, $offset: Int) {
    leads(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      email
      phone
      company
      score
      stage
      expectedValue
      source
      createdAt
      updatedAt
      customer {
        id
        name
        email
      }
      campaign {
        id
        name
        type
      }
    }
  }
`;

export const GET_LEAD_DETAILS = `
  query GetLeadDetails($id: ID!) {
    lead(id: $id) {
      id
      name
      email
      phone
      company
      score
      stage
      expectedValue
      source
      notes
      createdAt
      updatedAt
      customer {
        id
        name
        email
        company
      }
      campaign {
        id
        name
        type
        status
      }
    }
  }
`;

export const GET_CAMPAIGNS = `
  query GetCampaigns($filter: CampaignFilter, $limit: Int, $offset: Int) {
    campaigns(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      description
      type
      status
      budget
      spent
      roi
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_CAMPAIGN_DETAILS = `
  query GetCampaignDetails($id: ID!) {
    campaign(id: $id) {
      id
      name
      description
      type
      status
      budget
      spent
      roi
      startDate
      endDate
      createdAt
      updatedAt
      leads {
        id
        name
        email
        stage
        score
        expectedValue
      }
      customers {
        id
        name
        email
        value
        status
      }
    }
  }
`;

export const SEARCH_ALL = `
  query SearchAll($query: String!) {
    searchAll(query: $query) {
      customers {
        id
        name
        email
        company
        value
        status
      }
      leads {
        id
        name
        email
        company
        score
        stage
      }
      campaigns {
        id
        name
        type
        status
        budget
        roi
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMERS = `
  query GetActiveCustomers($limit: Int) {
    customers(filter: { status: ACTIVE }, limit: $limit) {
      id
      name
      email
      company
      value
      createdAt
    }
  }
`;

export const GET_QUALIFIED_LEADS = `
  query GetQualifiedLeads($limit: Int) {
    leads(filter: { stage: QUALIFIED }, limit: $limit) {
      id
      name
      email
      company
      score
      expectedValue
      createdAt
    }
  }
`;

export const GET_ACTIVE_CAMPAIGNS = `
  query GetActiveCampaigns($limit: Int) {
    campaigns(filter: { status: ACTIVE }, limit: $limit) {
      id
      name
      type
      budget
      spent
      roi
      startDate
      endDate
    }
  }
`;

export const GET_HIGH_VALUE_CUSTOMERS = `
  query GetHighValueCustomers($minValue: Float!, $limit: Int) {
    customers(filter: { minValue: $minValue, status: ACTIVE }, limit: $limit) {
      id
      name
      email
      company
      value
      status
      createdAt
    }
  }
`;

export const GET_TOP_PERFORMING_CAMPAIGNS = `
  query GetTopPerformingCampaigns($limit: Int) {
    campaigns(filter: { status: ACTIVE }, limit: $limit) {
      id
      name
      type
      budget
      spent
      roi
      leads {
        id
        stage
      }
    }
  }
`;