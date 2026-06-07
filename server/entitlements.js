const PLAN_FEATURES = {
  pro: {
    fleetAccess: true,
    analytics: false,
    prioritySupport: false
  },

  elite: {
    fleetAccess: true,
    analytics: true,
    prioritySupport: false
  },

  super: {
    fleetAccess: true,
    analytics: true,
    prioritySupport: true
  }
};

function getFeatures(planId) {
  return PLAN_FEATURES[planId] || {
    fleetAccess: false,
    analytics: false,
    prioritySupport: false
  };
}

module.exports = { getFeatures };