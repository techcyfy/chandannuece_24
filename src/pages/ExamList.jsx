import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaFileAlt,
  FaTag,
  FaLayerGroup,
  FaShieldAlt,
  FaCloud,
  FaLock,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

import { vouchersData } from "../data/Vouchers";
import { getExamGuide } from "../data/examData";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const ExamList = () => {
  const { id, guideId } = useParams();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [examGuide, setExamGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * LOAD EXAM DATA
   * =========================================================
   *
   * This page supports TWO types of URLs:
   *
   * 1. /exam-list/aws
   * 2. /vouchers/1/exams
   *
   * Logo click will use:
   * /exam-list/aws
   */

  useEffect(() => {
    setLoading(true);

    // -----------------------------------------
    // CASE 1:
    // Logo click -> /exam-list/:guideId
    // -----------------------------------------
    if (guideId) {
      const normalizedGuideId = String(guideId)
        .trim()
        .toLowerCase();

      // Get exam guide directly from examData.js
      const guide = getExamGuide(normalizedGuideId);

      // Try to find a related voucher
      const relatedVoucher = vouchersData.find(
        (voucherItem) =>
          String(voucherItem.guideId)
            .trim()
            .toLowerCase() === normalizedGuideId
      );

      setVoucher(relatedVoucher || null);
      setExamGuide(guide || null);

      setLoading(false);
      return;
    }

    // -----------------------------------------
    // CASE 2:
    // Existing voucher URL
    // /vouchers/:id/exams
    // -----------------------------------------
    if (id) {
      const foundVoucher = vouchersData.find(
        (voucherItem) =>
          String(voucherItem._id) === String(id) ||
          String(voucherItem.code) === String(id) ||
          String(voucherItem.id) === String(id)
      );

      setVoucher(foundVoucher || null);

      if (foundVoucher) {
        const guide = getExamGuide(foundVoucher.guideId);

        setExamGuide(guide || null);
      } else {
        setExamGuide(null);
      }

      setLoading(false);
      return;
    }

    setVoucher(null);
    setExamGuide(null);
    setLoading(false);
  }, [id, guideId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading exam information...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // IF DATA NOT FOUND
  // =========================================================

  if (!voucher && !examGuide) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Exam Guide Not Found
          </h1>

          <p className="text-gray-600 mb-6">
            We couldn't find the exam information you are looking for.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DISPLAY GUIDE
  // =========================================================

  const displayGuide = examGuide || {
    title: `${voucher?.shortName || "Certification"} - Complete Exam Guide`,

    description: `Comprehensive guide for ${
      voucher?.shortName || "certification"
    } certification exams.`,

    levels: [
      {
        name: "Core Exams",

        exams: [
          {
            code: voucher?.code || "",
            name: voucher?.shortName || "Certification Exam",

            description: `Complete ${
              voucher?.shortName || "certification"
            } certification exam guide.`,
          },
        ],
      },
    ],

    whyCertify: [
      "Validate your professional skills",
      "Build a successful IT career",
      "Get recognized by employers",
      "Stay competitive in the job market",
    ],

    careerPaths: {
      "IT Professional": voucher?.code
        ? [voucher.code]
        : [],

      "Cloud Professional": voucher?.code
        ? [voucher.code]
        : [],

      "System Administrator": voucher?.code
        ? [voucher.code]
        : [],
    },
  };

  // =========================================================
  // DISPLAY INFORMATION
  // =========================================================

  const displayShortName =
    voucher?.shortName ||
    displayGuide.title ||
    "Certification Exam";

  const displayCode =
    voucher?.code || "";

  const displayCategory =
    voucher?.category ||
    "IT Certification";

  const levels = Array.isArray(displayGuide.levels)
    ? displayGuide.levels
    : [];

  const whyCertify = Array.isArray(displayGuide.whyCertify)
    ? displayGuide.whyCertify
    : [];

  const careerPaths =
    displayGuide.careerPaths &&
    typeof displayGuide.careerPaths === "object"
      ? displayGuide.careerPaths
      : {};

  // =========================================================
  // URL
  // =========================================================

  const currentExamUrl = guideId
    ? `/exam-list/${guideId}`
    : `/vouchers/${id}/exams`;

  // =========================================================
  // BREADCRUMB
  // =========================================================

  const breadcrumbItems = [
    {
      name: "Home",
      url: "/",
    },

    {
      name: "Vouchers",
      url: "/vouchers",
    },

    ...(voucher
      ? [
          {
            name: voucher.shortName || "Voucher",
            url: `/vouchers/${voucher._id || voucher.id || voucher.code}`,
          },
        ]
      : []),

    {
      name: "Exam Guide",
      url: currentExamUrl,
    },
  ];

  // =========================================================
  // ICON
  // =========================================================

  const getIconForLevel = (levelName = "") => {
    const name = levelName.toLowerCase();

    if (
      name.includes("security") ||
      name.includes("compliance")
    ) {
      return <FaShieldAlt />;
    }

    if (
      name.includes("cloud") ||
      name.includes("fundamental")
    ) {
      return <FaCloud />;
    }

    if (
      name.includes("professional") ||
      name.includes("associate")
    ) {
      return <FaLayerGroup />;
    }

    if (name.includes("core")) {
      return <FaLock />;
    }

    return <FaFileAlt />;
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${displayShortName}${
      displayCode ? ` (${displayCode})` : ""
    } certification voucher. Can you please share more details?`
  );

  const whatsappUrl = `https://wa.me/8801982188224?text=${whatsappMessage}`;

  // =========================================================
  // TELEGRAM
  // =========================================================

  const telegramMessage = encodeURIComponent(
    `Hi, I'm interested in the ${displayShortName}${
      displayCode ? ` (${displayCode})` : ""
    } certification voucher.`
  );

  const telegramUrl = `https://t.me/techcyfy?text=${telegramMessage}`;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <Helmet>
        <title>
          Exam Guide - {displayShortName} | Techcyfy
        </title>

        <meta
          name="description"
          content={
            displayGuide.description ||
            `Complete exam guide for ${displayShortName}.`
          }
        />

        <link
          rel="canonical"
          href={`https://techcyfy.com${currentExamUrl}`}
        />
      </Helmet>

      <BreadcrumbSchema items={breadcrumbItems} />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================================================= */}
          {/* BACK BUTTON */}
          {/* ================================================= */}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition"
          >
            <FaArrowLeft />

            <span>
              Back
            </span>
          </button>

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                  <FaTag />

                  <span className="font-medium">
                    {displayCategory}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {displayGuide.title ||
                    `${displayShortName} Exam Guide`}
                </h1>

                {displayCode && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Exam Code:
                    </span>

                    <span className="text-blue-600 font-bold">
                      {displayCode}
                    </span>
                  </div>
                )}
              </div>

            </div>

            {displayGuide.description && (
              <p className="mt-6 text-gray-600 leading-7">
                {displayGuide.description}
              </p>
            )}
          </motion.div>

          {/* ================================================= */}
          {/* CERTIFICATION LEVELS */}
          {/* ================================================= */}

          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Certification Levels
              </h2>

              <p className="text-gray-600 mt-2">
                Explore all available certification exams
                and their levels.
              </p>
            </div>

            <div className="space-y-6">

              {levels.length > 0 ? (
                levels.map((level, levelIndex) => {
                  const exams = Array.isArray(level.exams)
                    ? level.exams
                    : [];

                  return (
                    <motion.div
                      key={`${level.name}-${levelIndex}`}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
                    >
                      {/* Level Header */}

                      <div className="flex items-center gap-4 mb-6">

                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                          {getIconForLevel(level.name)}
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                            {level.name ||
                              level.level ||
                              "Certification Level"}
                          </h3>

                          <p className="text-gray-500">
                            {exams.length}{" "}
                            {exams.length === 1
                              ? "exam"
                              : "exams"}
                          </p>
                        </div>

                      </div>

                      {/* Exams */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {exams.map((exam, examIndex) => (
                          <div
                            key={`${exam.code || exam.name}-${examIndex}`}
                            className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition"
                          >
                            <div className="flex items-start gap-3">

                              <div className="mt-1 text-green-500">
                                <FaCheckCircle />
                              </div>

                              <div className="flex-1">

                                <h4 className="font-bold text-lg text-gray-900">
                                  {exam.name ||
                                    "Certification Exam"}
                                </h4>

                                {exam.code && (
                                  <p className="text-blue-600 font-semibold mt-1">
                                    {exam.code}
                                  </p>
                                )}

                                {exam.description && (
                                  <p className="text-gray-600 mt-3 leading-6">
                                    {exam.description}
                                  </p>
                                )}

                              </div>

                            </div>
                          </div>
                        ))}

                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-gray-600">
                    No exam information available.
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* ================================================= */}
          {/* WHY GET CERTIFIED */}
          {/* ================================================= */}

          {whyCertify.length > 0 && (
            <section className="mb-10">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Why Get Certified?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {whyCertify.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="text-green-500 mt-1">
                        <FaCheckCircle />
                      </div>

                      <p className="text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}

                </div>

              </div>
            </section>
          )}

          {/* ================================================= */}
          {/* CAREER PATHS */}
          {/* ================================================= */}

          {Object.keys(careerPaths).length > 0 && (
            <section className="mb-10">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Career Paths
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {Object.entries(careerPaths).map(
                    ([career, exams], index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-5"
                      >
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          {career}
                        </h3>

                        <div className="space-y-2">

                          {Array.isArray(exams) &&
                            exams.map(
                              (examCode, examIndex) => (
                                <div
                                  key={examIndex}
                                  className="flex items-center gap-2 text-gray-600"
                                >
                                  <FaCheckCircle className="text-green-500" />

                                  <span>
                                    {examCode}
                                  </span>
                                </div>
                              )
                            )}

                        </div>
                      </div>
                    )
                  )}

                </div>

              </div>
            </section>
          )}

          {/* ================================================= */}
          {/* CONTACT / CTA */}
          {/* ================================================= */}

          <section>
            <div className="bg-blue-600 rounded-2xl p-6 md:p-10 text-white text-center">

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Need This Certification Voucher?
              </h2>

              <p className="text-blue-100 mb-7 max-w-2xl mx-auto">
                Contact us to get more information about
                {displayShortName} certification vouchers,
                pricing and delivery.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  <FaWhatsapp className="text-xl" />

                  WhatsApp
                </a>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition"
                >
                  <FaTelegramPlane className="text-xl" />

                  Telegram
                </a>

              </div>

            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default ExamList;