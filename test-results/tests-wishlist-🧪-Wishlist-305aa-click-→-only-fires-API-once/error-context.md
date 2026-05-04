# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/wishlist.spec.ts >> 🧪 Wishlist Feature — Full QA Suite >> ✅ Case 4: Double-click → only fires API once
- Location: tests/wishlist.spec.ts:110:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: browserContext.close: Test timeout of 30000ms exceeded.
Browser logs:

[pid=25128][err] [0407/111537.751667:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede2a000
[pid=25128][err] [0407/111537.751684:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751690:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede21000
[pid=25128][err] [0407/111537.751707:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751713:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede10000
[pid=25128][err] [0407/111537.751730:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751736:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede0a000
[pid=25128][err] [0407/111537.751750:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751755:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de606c000
[pid=25128][err] [0407/111537.751769:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751775:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de5dec000
[pid=25128][err] [0407/111537.751788:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751794:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de2e09000
[pid=25128][err] [0407/111537.751810:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751816:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709decff9000
[pid=25128][err] [0407/111537.751829:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751838:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709ddabf5000
[pid=25128][err] [0407/111537.751853:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751893:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de7957000
[pid=25128][err] [0407/111537.751907:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751913:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dda9f7000
[pid=25128][err] [0407/111537.751926:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751932:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dda75e000
[pid=25128][err] [0407/111537.751949:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751955:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede4f000
[pid=25128][err] [0407/111537.751967:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751973:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dd5421000
[pid=25128][err] [0407/111537.751990:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.751996:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dedde5000
[pid=25128][err] [0407/111537.752012:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752017:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709deddd6000
[pid=25128][err] [0407/111537.752033:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752038:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de79fc000
[pid=25128][err] [0407/111537.752054:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752060:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de79dd000
[pid=25128][err] [0407/111537.752076:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752081:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709decfc4000
[pid=25128][err] [0407/111537.752097:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752102:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de7979000
[pid=25128][err] [0407/111537.752117:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752123:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de7903000
[pid=25128][err] [0407/111537.752139:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752145:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de71f3000
[pid=25128][err] [0407/111537.752160:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752165:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de3980000
[pid=25128][err] [0407/111537.752184:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752189:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dede40000
[pid=25128][err] [0407/111537.752201:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752207:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dcea8a000
[pid=25128][err] [0407/111537.752220:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752226:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de394f000
[pid=25128][err] [0407/111537.752239:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752245:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de38b4000
[pid=25128][err] [0407/111537.752256:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752262:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dcdb83000
[pid=25128][err] [0407/111537.752275:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752281:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de3823000
[pid=25128][err] [0407/111537.752292:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752298:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dcc5d3000
[pid=25128][err] [0407/111537.752308:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752314:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dcb5d1000
[pid=25128][err] [0407/111537.752325:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752331:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dca48b000
[pid=25128][err] [0407/111537.752342:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752348:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709dc98c6000
[pid=25128][err] [0407/111537.752362:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.752367:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:542] no module mappings 0x709de60a5000
[pid=25128][err] [0407/111537.771779:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771819:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771828:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771836:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771844:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771851:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771884:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771891:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771898:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771906:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771914:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771921:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771928:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771935:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771942:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771950:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771957:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771965:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771972:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771981:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771988:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.771995:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772003:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772010:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772017:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772024:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772031:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772038:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772045:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772052:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772059:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772067:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772074:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772083:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772099:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772106:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772113:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772120:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772128:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772134:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772141:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772148:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772155:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772162:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772169:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772176:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772183:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772190:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772197:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772204:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772211:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772218:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772226:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772233:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772241:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772247:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772254:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772261:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772269:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772276:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772283:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772290:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772297:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772304:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772311:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111537.772320:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455416:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455617:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455640:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455673:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455691:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455704:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455716:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455729:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455741:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455753:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.455765:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.468752:ERROR:third_party/crashpad/crashpad/util/linux/ptracer.cc:454] ptrace: No such process (3)
[pid=25128][err] [0407/111543.522140:ERROR:third_party/crashpad/crashpad/util/linux/ptracer.cc:480] Unexpected registers size 0 != 216
[pid=25128][err] [0407/111543.522155:WARNING:third_party/crashpad/crashpad/snapshot/linux/process_reader_linux.cc:400] Couldn't initialize main thread.
[pid=25128][err] [0407/111543.574463:ERROR:third_party/crashpad/crashpad/util/process/process_memory.cc:41] short read
[pid=25128][err] [0407/111543.574484:ERROR:third_party/crashpad/crashpad/snapshot/linux/process_snapshot_linux.cc:78] Couldn't read exception info
[pid=25128][err] [0407/111543.601085:ERROR:third_party/crashpad/crashpad/util/linux/scoped_ptrace_attach.cc:45] ptrace: No such process (3)
```
