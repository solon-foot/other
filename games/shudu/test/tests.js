/**
 * Created by zhangzhi on 16/6/15.
 */
//https://qunitjs.com/ 使用quit进行单元测试

QUnit.test("计算", function (assert) {
    let shudu = new Shudu(getGame(0));
    shud2 = execute(shudu);
    console.log(shud2.toString());
    assert.ok(true,"yes");
})

QUnit.test("数据是否有解",function(assert) {
    var size = games.length;
    for(var i=0;i<size;i++) {
        assert.ok(execute(new Shudu(getGame(i)),"yes"+i));
    }
})
