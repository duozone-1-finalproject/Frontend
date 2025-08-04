import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import { ReportCanvas } from '../components/ReportCanvas';
import { generateSecuritiesReportTemplate } from '../api/GetData'
import { useNavigate } from "react-router-dom"

const EditPage = () => {
    const router = useNavigate()
    const [reportId, setReportId] = useState<number | null>(999);
    const [showSidebar, setShowSidebar] = useState(true);

    const [showCanvas, setShowCanvas] = useState(false)
    const [generatedReport, setGeneratedReport] = useState("")


    useEffect(() => {
        setReportId(999);
        const demoReport = generateSecuritiesReportTemplate()
        setGeneratedReport(demoReport)
    }, []);

    return (
        <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
        <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
            {/* 우측 (TipTap 에디터 영역) */}
            <div className="w-full p-4 flex flex-col bg-gray-50 overflow-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-700">보고서 내용 편집</h2>
            <div className="flex-1 overflow-auto">
                <ReportCanvas reportContent={generatedReport} onBack={() => router('/main')} />
            </div>
            </div>
        </div>
        </div>
    );
    };

export default EditPage;