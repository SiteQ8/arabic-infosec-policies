#!/usr/bin/env node

/**
 * أداة سطر الأوامر لسياسات أمن المعلومات بالعربية
 * Arabic InfoSec Policies CLI Tool
 * 
 * @author AlEnezi (SiteQ8)
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

// === Colors for terminal ===
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    gold: '\x1b[33m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    bgDark: '\x1b[40m',
    white: '\x1b[37m',
};

const BANNER = `
${c.gold}${c.bold}
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║   🛡️  سياسات أمن المعلومات بالعربية  🛡️              ║
    ║   Arabic InfoSec Policies v2.0                       ║
    ║                                                      ║
    ║   By AlEnezi (SiteQ8)                                ║
    ║   https://github.com/SiteQ8/arabic-infosec-policies  ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
${c.reset}`;

// === Policy Registry ===
const POLICIES = [
    {
        id: 'comprehensive',
        name: 'السياسة الشاملة لأمن المعلومات',
        nameEn: 'Comprehensive InfoSec Policy',
        file: 'policies/comprehensive_infosec_policy.md',
        standards: ['ISO 27001:2022', 'NIST CSF 2.0', 'CIS Controls v8'],
        sections: 15,
    },
    {
        id: 'access_control',
        name: 'سياسة التحكم في الوصول',
        nameEn: 'Access Control Policy',
        file: 'policies/access_control_policy.md',
        standards: ['ISO 27001', 'NIST', 'Zero Trust'],
        sections: 10,
    },
    {
        id: 'ai_governance',
        name: 'سياسة حوكمة الذكاء الاصطناعي',
        nameEn: 'AI Governance Policy',
        file: 'policies/ai_governance_policy.md',
        standards: ['NIST AI RMF', 'EU AI Act', 'ISO 42001'],
        sections: 12,
    },
    {
        id: 'zero_trust',
        name: 'سياسة الثقة الصفرية',
        nameEn: 'Zero Trust Policy',
        file: 'policies/zero_trust_policy.md',
        standards: ['NIST SP 800-207', 'CISA ZTA', 'Forrester ZTX'],
        sections: 14,
    },
];

const TEMPLATES = [
    { id: 'policy_template', name: 'قالب السياسة الأمنية', file: 'templates/policy_template.md' },
    { id: 'risk_assessment', name: 'قالب تقييم المخاطر', file: 'templates/risk_assessment_template.xlsx' },
    { id: 'compliance_checklist', name: 'قائمة فحص الامتثال', file: 'templates/compliance_checklist.md' },
];

const EXAMPLES = [
    { id: 'banking', name: 'القطاع المصرفي', file: 'examples/banking_example.md' },
    { id: 'healthcare', name: 'قطاع الرعاية الصحية', file: 'examples/healthcare_example.md' },
    { id: 'government', name: 'القطاع الحكومي', file: 'examples/government_example.md' },
];

const STANDARDS_COVERAGE = [
    { standard: 'ISO/IEC 27001:2022', coverage: 100, status: 'مكتملة' },
    { standard: 'NIST CSF 2.0', coverage: 100, status: 'مكتملة' },
    { standard: 'CIS Controls v8', coverage: 95, status: 'مكتملة' },
    { standard: 'Zero Trust', coverage: 100, status: 'مكتملة' },
    { standard: 'AI Governance', coverage: 100, status: 'مكتملة' },
    { standard: 'GDPR', coverage: 90, status: 'جزئية' },
    { standard: 'CBK CORF', coverage: 60, status: 'جزئية' },
    { standard: 'PCI DSS', coverage: 65, status: 'جزئية' },
    { standard: 'SWIFT CSP', coverage: 30, status: 'جزئية' },
];

// === Helpers ===
function getBasePath() {
    // Check if running from package or local
    const localPath = path.join(process.cwd(), 'policies');
    if (fs.existsSync(localPath)) return process.cwd();
    const pkgPath = path.join(__dirname, '..');
    if (fs.existsSync(path.join(pkgPath, 'policies'))) return pkgPath;
    return process.cwd();
}

function progressBar(percent, width = 20) {
    const filled = Math.round(percent / 100 * width);
    const empty = width - filled;
    const color = percent >= 90 ? c.green : percent >= 60 ? c.gold : c.red;
    return `${color}${'█'.repeat(filled)}${c.dim}${'░'.repeat(empty)}${c.reset} ${percent}%`;
}

function divider() {
    return `${c.dim}${'─'.repeat(60)}${c.reset}`;
}

// === Commands ===
function cmdHelp() {
    console.log(BANNER);
    console.log(`${c.bold}الأوامر المتاحة:${c.reset}\n`);
    console.log(`  ${c.cyan}list${c.reset}                        عرض جميع السياسات والقوالب`);
    console.log(`  ${c.cyan}show${c.reset} ${c.dim}<policy-id>${c.reset}             عرض محتوى سياسة معينة`);
    console.log(`  ${c.cyan}audit${c.reset}                       فحص تغطية المعايير`);
    console.log(`  ${c.cyan}audit${c.reset} ${c.dim}--standard <name>${c.reset}      فحص معيار محدد`);
    console.log(`  ${c.cyan}export${c.reset} ${c.dim}--policy <id>${c.reset}          تصدير سياسة`);
    console.log(`  ${c.cyan}customize${c.reset} ${c.dim}--org <name>${c.reset}       تخصيص السياسات لمؤسستك`);
    console.log(`  ${c.cyan}stats${c.reset}                       إحصائيات المستودع`);
    console.log(`  ${c.cyan}help${c.reset}                        عرض هذه المساعدة`);
    console.log();
    console.log(`${c.dim}مثال:${c.reset}`);
    console.log(`  ${c.gold}$ arabic-infosec list${c.reset}`);
    console.log(`  ${c.gold}$ arabic-infosec audit --standard iso27001${c.reset}`);
    console.log(`  ${c.gold}$ arabic-infosec show comprehensive${c.reset}`);
    console.log();
}

function cmdList() {
    console.log(BANNER);
    
    console.log(`\n${c.gold}${c.bold}📋 السياسات الأساسية (${POLICIES.length})${c.reset}\n`);
    POLICIES.forEach((p, i) => {
        console.log(`  ${c.cyan}${i + 1}.${c.reset} ${c.bold}${p.name}${c.reset}`);
        console.log(`     ${c.dim}ID: ${p.id} | ${p.sections} قسم | ${p.nameEn}${c.reset}`);
        console.log(`     ${c.dim}المعايير: ${p.standards.join(', ')}${c.reset}`);
        console.log();
    });

    console.log(divider());
    console.log(`\n${c.gold}${c.bold}📝 القوالب (${TEMPLATES.length})${c.reset}\n`);
    TEMPLATES.forEach((t, i) => {
        console.log(`  ${c.cyan}${i + 1}.${c.reset} ${c.bold}${t.name}${c.reset} ${c.dim}(${t.id})${c.reset}`);
    });

    console.log(`\n${c.gold}${c.bold}🏢 أمثلة قطاعية (${EXAMPLES.length})${c.reset}\n`);
    EXAMPLES.forEach((e, i) => {
        console.log(`  ${c.cyan}${i + 1}.${c.reset} ${c.bold}${e.name}${c.reset} ${c.dim}(${e.id})${c.reset}`);
    });
    console.log();
}

function cmdAudit(standard) {
    console.log(BANNER);
    console.log(`\n${c.gold}${c.bold}🔍 تقرير فحص الامتثال${c.reset}\n`);
    console.log(divider());

    const items = standard 
        ? STANDARDS_COVERAGE.filter(s => s.standard.toLowerCase().includes(standard.toLowerCase()))
        : STANDARDS_COVERAGE;

    if (items.length === 0) {
        console.log(`\n  ${c.red}لم يتم العثور على المعيار: ${standard}${c.reset}\n`);
        return;
    }

    items.forEach(s => {
        const statusColor = s.coverage >= 90 ? c.green : s.coverage >= 60 ? c.gold : c.red;
        const statusIcon = s.coverage >= 90 ? '✅' : '⚠️';
        console.log(`\n  ${c.bold}${s.standard}${c.reset}`);
        console.log(`  ${progressBar(s.coverage, 30)}`);
        console.log(`  ${statusIcon} ${statusColor}${s.status}${c.reset}`);
    });

    console.log(`\n${divider()}`);
    const avg = Math.round(items.reduce((a, s) => a + s.coverage, 0) / items.length);
    console.log(`\n  ${c.bold}متوسط التغطية:${c.reset} ${progressBar(avg, 30)}`);
    console.log();
}

function cmdShow(policyId) {
    const basePath = getBasePath();
    const all = [...POLICIES, ...TEMPLATES, ...EXAMPLES];
    const item = all.find(p => p.id === policyId);

    if (!item) {
        console.log(`\n  ${c.red}❌ السياسة غير موجودة: ${policyId}${c.reset}`);
        console.log(`  ${c.dim}استخدم 'arabic-infosec list' لعرض السياسات المتاحة${c.reset}\n`);
        return;
    }

    const filePath = path.join(basePath, item.file);
    if (!fs.existsSync(filePath)) {
        console.log(`\n  ${c.red}❌ الملف غير موجود: ${item.file}${c.reset}\n`);
        return;
    }

    console.log(BANNER);
    console.log(`${c.gold}${c.bold}📄 ${item.name}${c.reset}`);
    console.log(divider());
    console.log(fs.readFileSync(filePath, 'utf-8'));
}

function cmdExport(policyId, format) {
    const basePath = getBasePath();
    const all = [...POLICIES, ...TEMPLATES, ...EXAMPLES];
    const item = all.find(p => p.id === policyId);

    if (!item) {
        console.log(`\n  ${c.red}❌ السياسة غير موجودة: ${policyId}${c.reset}\n`);
        return;
    }

    const src = path.join(basePath, item.file);
    const dest = path.join(process.cwd(), `${item.id}_export.md`);

    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`\n  ${c.green}✅ تم التصدير: ${dest}${c.reset}\n`);
    } else {
        console.log(`\n  ${c.red}❌ الملف غير موجود${c.reset}\n`);
    }
}

function cmdCustomize(orgName, sector) {
    const basePath = getBasePath();
    const outDir = path.join(process.cwd(), 'customized-policies');

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    console.log(BANNER);
    console.log(`\n${c.gold}${c.bold}⚙️ تخصيص السياسات${c.reset}`);
    console.log(`  ${c.dim}المؤسسة: ${orgName || 'غير محدد'}${c.reset}`);
    console.log(`  ${c.dim}القطاع: ${sector || 'عام'}${c.reset}\n`);

    POLICIES.forEach(policy => {
        const src = path.join(basePath, policy.file);
        if (!fs.existsSync(src)) return;

        let content = fs.readFileSync(src, 'utf-8');
        if (orgName) {
            content = content.replace(/\[اسم المؤسسة\]/g, orgName);
            content = content.replace(/\[اسم المسؤول التنفيذي \/ Executive Name\]/g, `[مسؤول ${orgName}]`);
        }

        const dest = path.join(outDir, path.basename(policy.file));
        fs.writeFileSync(dest, content, 'utf-8');
        console.log(`  ${c.green}✅${c.reset} ${policy.name} → ${dest}`);
    });

    console.log(`\n  ${c.green}${c.bold}تم تخصيص ${POLICIES.length} سياسات بنجاح!${c.reset}`);
    console.log(`  ${c.dim}المجلد: ${outDir}${c.reset}\n`);
}

function cmdStats() {
    const basePath = getBasePath();
    console.log(BANNER);
    console.log(`\n${c.gold}${c.bold}📊 إحصائيات المستودع${c.reset}\n`);
    
    let totalLines = 0;
    let totalWords = 0;
    let fileCount = 0;

    const countFile = (filePath) => {
        if (!fs.existsSync(filePath)) return;
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).length;
        totalLines += lines;
        totalWords += words;
        fileCount++;
    };

    [...POLICIES, ...TEMPLATES.filter(t => t.file.endsWith('.md')), ...EXAMPLES].forEach(p => {
        countFile(path.join(basePath, p.file));
    });

    console.log(`  ${c.cyan}📄 الملفات:${c.reset}       ${fileCount}`);
    console.log(`  ${c.cyan}📝 الأسطر:${c.reset}        ${totalLines.toLocaleString()}`);
    console.log(`  ${c.cyan}📖 الكلمات:${c.reset}       ${totalWords.toLocaleString()}`);
    console.log(`  ${c.cyan}📋 السياسات:${c.reset}      ${POLICIES.length}`);
    console.log(`  ${c.cyan}📝 القوالب:${c.reset}       ${TEMPLATES.length}`);
    console.log(`  ${c.cyan}🏢 الأمثلة:${c.reset}       ${EXAMPLES.length}`);
    console.log(`  ${c.cyan}🏛️ المعايير:${c.reset}      ${STANDARDS_COVERAGE.length}`);
    console.log();
}

// === MAIN ===
const args = process.argv.slice(2);
const command = args[0] || 'help';

function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 && args[idx + 1] ? args[idx + 1] : null;
}

switch (command) {
    case 'list':
        cmdList();
        break;
    case 'show':
        cmdShow(args[1] || getArg('policy'));
        break;
    case 'audit':
        cmdAudit(getArg('standard'));
        break;
    case 'export':
        cmdExport(getArg('policy'), getArg('format'));
        break;
    case 'customize':
        cmdCustomize(getArg('org'), getArg('sector'));
        break;
    case 'stats':
        cmdStats();
        break;
    case 'help':
    case '--help':
    case '-h':
    default:
        cmdHelp();
        break;
}
