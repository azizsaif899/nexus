// CRM GraphQL Mutations

export const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
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

export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
      email
      phone
      company
      value
      status
      updatedAt
    }
  }
`;

export const DELETE_CUSTOMER = `
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;

export const CREATE_LEAD = `
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(input: $input) {
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
      }
      campaign {
        id
        name
      }
    }
  }
`;

export const UPDATE_LEAD = `
  mutation UpdateLead($id: ID!, $input: UpdateLeadInput!) {
    updateLead(id: $id, input: $input) {
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
      updatedAt
      customer {
        id
        name
      }
      campaign {
        id
        name
      }
    }
  }
`;

export const DELETE_LEAD = `
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id)
  }
`;

export const CONVERT_LEAD_TO_CUSTOMER = `
  mutation ConvertLeadToCustomer($leadId: ID!) {
    convertLeadToCustomer(leadId: $leadId) {
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

export const CREATE_CAMPAIGN = `
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      description
      type
      status
      budget
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CAMPAIGN = `
  mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      name
      description
      type
      status
      budget
      spent
      startDate
      endDate
      updatedAt
    }
  }
`;

export const DELETE_CAMPAIGN = `
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

// Batch operations
export const CREATE_MULTIPLE_LEADS = `
  mutation CreateMultipleLeads($leads: [CreateLeadInput!]!) {
    leads: createMultipleLeads(inputs: $leads) {
      id
      name
      email
      stage
      score
      createdAt
    }
  }
`;

export const UPDATE_LEAD_STAGE = `
  mutation UpdateLeadStage($id: ID!, $stage: LeadStage!) {
    updateLead(id: $id, input: { stage: $stage }) {
      id
      name
      stage
      updatedAt
    }
  }
`;

export const UPDATE_CUSTOMER_STATUS = `
  mutation UpdateCustomerStatus($id: ID!, $status: CustomerStatus!) {
    updateCustomer(id: $id, input: { status: $status }) {
      id
      name
      status
      updatedAt
    }
  }
`;

export const UPDATE_CAMPAIGN_STATUS = `
  mutation UpdateCampaignStatus($id: ID!, $status: CampaignStatus!) {
    updateCampaign(id: $id, input: { status: $status }) {
      id
      name
      status
      updatedAt
    }
  }
`;

export const BULK_UPDATE_LEADS = `
  mutation BulkUpdateLeads($updates: [BulkLeadUpdate!]!) {
    bulkUpdateLeads(updates: $updates) {
      success
      updated
      failed
      errors
    }
  }
`;

export const ASSIGN_LEADS_TO_CAMPAIGN = `
  mutation AssignLeadsToCampaign($leadIds: [ID!]!, $campaignId: ID!) {
    assignLeadsToCampaign(leadIds: $leadIds, campaignId: $campaignId) {
      success
      assigned
      failed
    }
  }
`;