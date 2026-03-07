/**
 * اختبارات أساسية لسياسات أمن المعلومات
 * Basic tests for Arabic InfoSec Policies
 */

const { getPolicy, listPolicies, customizePolicy, getComplianceCoverage } = require('./index');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (err) {
        console.log(`  ❌ ${name}: ${err.message}`);
        failed++;
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 تشغيل الاختبارات...\n');

// Policy listing
test('يجب أن تعرض listPolicies 4 سياسات', () => {
    const policies = listPolicies();
    assert(policies.length === 4, `Expected 4, got ${policies.length}`);
});

// Policy retrieval
test('يجب أن تعيد getPolicy محتوى السياسة الشاملة', () => {
    const policy = getPolicy('comprehensive');
    assert(policy !== null, 'Policy is null');
    assert(policy.content.length > 0, 'Content is empty');
    assert(policy.meta.id === 'comprehensive', 'Wrong ID');
});

test('يجب أن تعيد getPolicy null لسياسة غير موجودة', () => {
    const policy = getPolicy('nonexistent');
    assert(policy === null, 'Should be null');
});

// All policies exist
test('يجب أن تكون جميع ملفات السياسات موجودة', () => {
    const policies = listPolicies();
    policies.forEach(p => {
        const exists = fs.existsSync(path.join(__dirname, '..', p.file));
        assert(exists, `Missing file: ${p.file}`);
    });
});

// Customization
test('يجب أن تستبدل customizePolicy اسم المؤسسة', () => {
    const result = customizePolicy('comprehensive', { orgName: 'شركة الاختبار' });
    assert(result !== null, 'Result is null');
    assert(!result.includes('[اسم المؤسسة]'), 'Placeholder not replaced');
    assert(result.includes('شركة الاختبار'), 'Org name not found');
});

// Compliance coverage
test('يجب أن تعيد getComplianceCoverage بيانات لـ 9 معايير', () => {
    const coverage = getComplianceCoverage();
    assert(coverage.length === 9, `Expected 9, got ${coverage.length}`);
});

test('يجب أن تكون نسب التغطية بين 0 و 100', () => {
    const coverage = getComplianceCoverage();
    coverage.forEach(c => {
        assert(c.coverage >= 0 && c.coverage <= 100, `Invalid: ${c.coverage}`);
    });
});

// Arabic content check
test('يجب أن يكون المحتوى باللغة العربية', () => {
    const policy = getPolicy('comprehensive');
    const hasArabic = /[\u0600-\u06FF]/.test(policy.content);
    assert(hasArabic, 'No Arabic characters found');
});

console.log(`\n${'-'.repeat(40)}`);
console.log(`  النتائج: ${passed} ناجح, ${failed} فاشل`);
console.log(`${'-'.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
