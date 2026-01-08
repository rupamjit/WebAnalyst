import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        
        if (!body.websiteId || !body.domain) {
            return NextResponse.json(
                { error: "Missing required fields: websiteId and domain" }, 
                { status: 400 }
            );
        }

        const trackingType = body.type || "entry";
        console.log(`Tracking ${trackingType} for website:`, body.websiteId);

        // Get IP address
        const ip = req.headers.get('x-real-ip') || 
                   req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-vercel-forwarded-for') ||
                   '127.0.0.1';

        // Get geolocation data
        let geoData = null;
        if (ip !== '127.0.0.1' && ip !== 'localhost') {
            try {
                const geoResponse = await axios.get(
                    `http://ip-api.com/json/${ip}`,
                    { timeout: 3000 } 
                );
                geoData = geoResponse.data;
            } catch (geoError) {
                console.error("Geolocation lookup failed:", geoError);
            }
        }

        // Parse user agent
        const userAgent = body.userAgent || req.headers.get("user-agent") || "";
        const result = UAParser(userAgent);
        
        const device = result.device.type || "desktop";
        const browser = result.browser.name || "Unknown";
        const os = result.os.name || "Unknown";

        const trackingData = {
            ...body,
            ip,
            device,
            browser,
            browserVersion: result.browser.version,
            os,
            osVersion: result.os.version,
            country: geoData?.country || null,
            region: geoData?.regionName || null,
            city: geoData?.city || null,
            timezone: geoData?.timezone || null,
            serverTimestamp: new Date().toISOString(),
        };

        console.log("Tracking Data:", trackingData);

        // Save to database
        const pageViewData = {
            type: trackingType,
            websiteId: body.websiteId,
            domain: body.domain,
            url: body.url || "",
            referrer: body.referrer || null,
            userAgent: userAgent || null,
            device: device || null,
            browser: browser || null,
            browserVersion: result.browser.version || null,
            os: os || null,
            osVersion: result.os.version || null,
            language: body.language || null,
            ip: ip || null,
            country: geoData?.country || null,
            region: geoData?.regionName || null,
            city: geoData?.city || null,
            timezone: geoData?.timezone || null,
            utm_source: body.utm_source || null,
            utm_medium: body.utm_medium || null,
            utm_campaign: body.utm_campaign || null,
            utm_term: body.utm_term || null,
            utm_content: body.utm_content || null,
        };

        if (trackingType === 'entry') {
            const pageView = await prisma.websitePageView.create({
                data: {
                    ...pageViewData,
                    entryTime: body.entryTime ? new Date(body.entryTime) : new Date(),
                }
            });
            
            console.log("Entry tracked with ID:", pageView.id);
            
            return NextResponse.json(
                { 
                    message: "Entry tracked successfully",
                    pageViewId: pageView.id 
                }, 
                { status: 200 }
            );
            
        } else if (trackingType === 'exit') {
            // Update existing page view with exit data
            if (body.pageViewId) {
                try {
                    const pageView = await prisma.websitePageView.update({
                        where: {
                            id: body.pageViewId
                        },
                        data: {
                            exitTime: body.exitTime ? new Date(body.exitTime) : new Date(),
                            activeTime: body.activeTime || null,
                        }
                    });
                    
                    console.log("Exit tracked for ID:", pageView.id);
                    
                    return NextResponse.json(
                        { message: "Exit tracked successfully" }, 
                        { status: 200 }
                    );
                } catch (updateError) {
                    console.error("Failed to update page view:", updateError);
                }
            }
            
            //  Create new exit record if no pageViewId or update failed
            const pageView = await prisma.websitePageView.create({
                data: {
                    ...pageViewData,
                    exitTime: body.exitTime ? new Date(body.exitTime) : new Date(),
                    activeTime: body.activeTime || null,
                }
            });
            
            console.log("Exit tracked (fallback) with ID:", pageView.id);
            
            return NextResponse.json(
                { message: "Exit tracked successfully" }, 
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: `${trackingType} tracked successfully` }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json(
            { error: "Failed to track website" }, 
            { status: 500 }
        );
    }
}