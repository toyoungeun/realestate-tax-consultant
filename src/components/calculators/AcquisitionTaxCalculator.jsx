import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import NumberInput from '../common/NumberInput.jsx';
import ResultDisplay from '../common/ResultDisplay.jsx';
import Select from '../common/Select.jsx';
import Checkbox from '../common/Checkbox.jsx';
import { calculateAcquisitionTax } from '../../lib/taxCalculations.js';
import { UNIT } from '../../data/taxRates2026.js';

export default function AcquisitionTaxCalculator() {
  const [input, setInput] = useState({
    acquisitionPrice: 8 * UNIT.억,
    area: 84,
    homeCount: 1,
    isRegulated: true,
    isFirstTime: false,
    isReducedArea: false,
    isCorporate: false,
  });

  const update = (key, value) => setInput((p) => ({ ...p, [key]: value }));

  const result = useMemo(() => calculateAcquisitionTax(input), [input]);

  return (
    <Card>
      <CardHeader
        icon="🏠"
        title="취득세 계산"
        subtitle="아파트 매수 시 발생하는 취득세 + 농어촌특별세 + 지방교육세를 계산합니다. (금액 단위: 만원)"
      />
      <CardBody>
        <div className="grid md:grid-cols-2 gap-4">
          <NumberInput
            label="취득가액"
            value={input.acquisitionPrice}
            onChange={(v) => update('acquisitionPrice', v)}
            placeholder="예: 80000 (= 8억) 또는 '8억'"
            help='만원 단위. "8억", "8억 5천" 같이 입력해도 인식됩니다.'
          />
          <NumberInput
            label="전용면적"
            value={input.area}
            unit="㎡"
            suffix="㎡"
            onChange={(v) => update('area', v)}
            help="85㎡ 이하 시 농어촌특별세 면제"
          />

          <Select
            label="취득 후 보유 주택수"
            value={input.homeCount}
            onChange={(v) => update('homeCount', Number(v))}
            options={[
              { value: 1, label: '1주택' },
              { value: 2, label: '2주택' },
              { value: 3, label: '3주택' },
              { value: 4, label: '4주택 이상' },
            ]}
          />

          <Select
            label="소재지"
            value={input.isRegulated ? 'regulated' : 'unregulated'}
            onChange={(v) => update('isRegulated', v === 'regulated')}
            options={[
              { value: 'regulated', label: '조정대상지역 (서울 전 지역, 경기 일부)' },
              { value: 'unregulated', label: '비조정대상지역' },
            ]}
          />

          <Checkbox
            label="생애최초 주택 구입"
            checked={input.isFirstTime}
            onChange={(v) => update('isFirstTime', v)}
            help="12억 이하 / 무주택 / 3년 내 처분 시 추징"
          />
          <Checkbox
            label="인구감소지역"
            checked={input.isReducedArea}
            onChange={(v) => update('isReducedArea', v)}
            help="생애최초 감면 한도 300만원 적용"
          />
          <Checkbox
            label="법인 명의 취득"
            checked={input.isCorporate}
            onChange={(v) => update('isCorporate', v)}
            help="법인은 무조건 12% 중과"
          />
        </div>

        <ResultDisplay result={result} />

        <div className="mt-4 text-xs text-slate-500 leading-relaxed">
          ※ 본 계산은 일반적인 매매 취득(유상취득) 기준입니다. 신축/원시취득, 증여/상속,
          분양권/조합원입주권은 별도 산식이 적용됩니다. 결과는 모두 만원 단위로 반올림되어
          표시됩니다.
        </div>
      </CardBody>
    </Card>
  );
}
