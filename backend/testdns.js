const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");

console.log("DNS Servers:", dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.bloggr.p0igni5.mongodb.net",
  (err, addresses) => {
    console.log("Error:", err);
    console.log("Addresses:", addresses);
  }
);