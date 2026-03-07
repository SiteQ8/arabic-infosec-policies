/**
 * arabic-infosec-policies
 * أكبر مجموعة مفتوحة المصدر من سياسات أمن المعلومات بالعربية
 * 
 * @author AlEnezi (SiteQ8)
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

const policies = {
    comprehensive: {
        id: 'comprehensive',
        name: 'السياسة الشاملة لأمن المعلومات',
        nameEn: 'Comprehensive InfoSec Policy',
        file: 'policies/comprehensive_infosec_policy.md',
        standards: ['ISO 27001:2022', 'NIST CSF 2.0', 'CIS Controls v8'],
    },
    access_control: {
        id: 'access_control',
        name: 'سياسة التحكم في الوصول',
        nameEn: 'Access Control Policy',
        file: 'policies/access_control_policy.md',
        standards: ['ISO 27001', 'NIST', 'Zero Trust'],
    },
    ai_governance: {
        id: 'ai_governance',
        name: 'سياسة حوكمة الذكاء الاصطناعي',
        nameEn: 'AI Governance Policy',
        file: 'policies/ai_governance_policy.md',
        standards: ['NIST AI RMF', 'EU AI Act', 'ISO 42001'],
    },
    zero_trust: {
        id: 'zero_trust',
        name: 'سياسة الثقة الصفرية',
        nameEn: 'Zero Trust Policy',
        file: 'policies/zero_trust_policy.md',
        standards: ['NIST SP 800-207', 'CISA ZTA'],
    },
};

/**
 * Get a policy by ID
 * @param {string} id - Policy identifier
 * @returns {{ meta: object, content: string } | null}
 */
function getPolicy(id) {
    const policy = policies[id];
    if (!policy) return null;
    const filePath = path.join(BASE, policy.file);
    if (!fs.existsSync(filePath)) return null;
    return {
        meta: policy,
        content: fs.readFileSync(filePath, 'utf-8'),
    };
}

/**
 * List all available policies
 * @returns {object[]}
 */
function listPolicies() {
    return Object.values(policies);
}

/**
 * Customize a policy by replacing placeholders
 * @param {string} id - Policy identifier
 * @param {object} options - Customization options
 * @param {string} options.orgName - Organization name
 * @returns {string | null} - Customized content
 */
function customizePolicy(id, options = {}) {
    const policy = getPolicy(id);
    if (!policy) return null;
    let content = policy.content;
    if (options.orgName) {
        content = content.replace(/\[اسم المؤسسة\]/g, options.orgName);
    }
    return content;
}

/**
 * Get compliance coverage data
 * @returns {object[]}
 */
function getComplianceCoverage() {
    return [
        { standard: 'ISO/IEC 27001:2022', coverage: 100 },
        { standard: 'NIST CSF 2.0', coverage: 100 },
        { standard: 'CIS Controls v8', coverage: 95 },
        { standard: 'Zero Trust', coverage: 100 },
        { standard: 'AI Governance', coverage: 100 },
        { standard: 'GDPR', coverage: 90 },
        { standard: 'CBK CORF', coverage: 60 },
        { standard: 'PCI DSS', coverage: 65 },
        { standard: 'SWIFT CSP', coverage: 30 },
    ];
}

module.exports = {
    getPolicy,
    listPolicies,
    customizePolicy,
    getComplianceCoverage,
    policies,
};
